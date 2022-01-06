const http = require('http')
const htmlparser2 = require('htmlparser2')
const css = require('css')
const main = require('./main')
const network = require('./network')
const render = require('./render')
const gpu = require('./gpu')
const { dir } = require('console')
const host = 'localhost'
const port = 8002
// 浏览器主进程接收请求，会把请求转发给网络进程
main.on('request', function(options) {
  // 会把请求转发给网络进程
  network.emit('request', options)
})

// 主进程 接收到消息后要通知渲染进程进行开始渲染
main.on('prepareRender', function (response) {
  // 主进程发送提交导航的消息给渲染进程
  render.emit('commitNavigation', response)
})

// ****************网络进程*******************************
network.on('request', (options) => {
  // 调用http模块发送请求给服务
  let request = http.request(options, (response) => {
    let headers = response.headers
    // 告诉主进程请开始渲染页面
    main.emit('prepareRender', response)
  })
  request.end()
})

// ******************渲染进程******************
render.on('commitNavigation', (response) => {
  const headers = response.headers
  // 获取 响应体的类型 渲染进程
  const contentType = headers['Content-Type'] || headers['content-type']
  // 说明这是一个HTML响应
  if (contentType.indexOf('text/html') !== -1) {
    const document = {
      type: 'document',
      attributes: {},
      children: []
    }
    const tokenStack = [document]
    const cssRules = []
    // 1. 通过渲染进程把html 字符串 转成 DOM树
    const parser = new htmlparser2.Parser({
      onopentag(tagName, attributes) { // 遇到开始标签
        // 栈顶的就是父节点
        const parent = tokenStack[tokenStack.length - 1]
        // 创建新的DOM节点
        const child = {
          type: 'element',
          tagName, // html
          children: [],
          attributes
        }
        parent.children.push(child)
        tokenStack.push(child)
      },
      ontext(text) {
        if (!/^[\r\n]*$/.test(text)) {
          // 文本节点不需要入栈
          const parent = tokenStack[tokenStack.length - 1]
          const child = {
            type: 'text',
            tagName: 'text', // html
            children: [],
            text,
            attributes: {}
          }
          parent.children.push(child)
        }
      },
      onclosetag(tagName) {
        switch(tagName) {
          case 'style':
            const styleToken = tokenStack[tokenStack.length - 1];
            const cssAST = css.parse(styleToken.children[0].text)
            const rules = cssAST.stylesheet.rules
            cssRules.push(...rules)
        }
        // 栈顶元素出栈
        tokenStack.pop()
      }
    })

    // 一旦接收到部分响应体，直接传递给htmlparser
    response.on('data', (buffer) => {
      parser.write(buffer.toString())
    })
    response.on('end', () => {
      // // const resultBuffer = Buffer.concat(buffers) // 二进制缓冲区
      // // const html = resultBuffer.toString() // 转成HTML字符串
      // console.log('html', html);
      // 计算每个DOM节点的具体样式 继承 层叠
      recalculateStyle(cssRules, document)
      // 创建一个只包含可见元素的布局树
      const html = document.children[0]
      const body = html.children[1]
      const layoutTree = createLayoutTree(body)
      // 更新布局树，计算每个元素布局信息
      updateLayoutTree(layoutTree)
      // // 根据布局树生成分层树
      // const layers = [layoutTree]
      // createLayerTree(layoutTree, layers)
      // // 根据分层树生成绘制步骤， 并复合图层
      // const paintSteps = compositeLayers(layers)
      // console.log(paintSteps.flat().join('\r\n'))
      // // 先切成一个个小的图块
      // const tiles = splitTiles(paintSteps)
      // raster(tiles)
      console.dir(layoutTree, { depth: null })
      // DOM 解析完毕
      main.emit('DOMContentLoaded')
      // CSS和图片加载完成后
      main.emit('Loaded')
    })
  }
})

// 切分图块
function splitTiles(paintSteps) {
  // 切分成一个个小图片
  return paintSteps
}

// 光栅化线程
// 1个光栅化线程 1s 绘制 1张
// 10个图片
// 10个线程 1s就可以绘制10张
function rasterThread(tile) {
  // 光栅化线程，而是把光栅化的工作交给GPU进程来完成，这个叫快速光栅化，或者说GPU光栅化
  gpu.emit('raster', tile)
}

// 把切好的图片进行光栅化处理，类似于马赛克处理
function raster(tiles) {
  tiles.forEach(tile => rasterThread(tile))
  // 到此位图生成完毕，通知主进程开始渲染页面
}

function compositeLayers(layers) {
  return layers.map(layer => paint(layer))
}

function paint(element, paintSteps = []) {
  const { top = 0, left = 0, color = 'black', background = 'white', width = 100, height = 0 } = element.layout
  if (element.type === 'text') {
    paintSteps.push(`ctx.font = '20px Impact'`);
    paintSteps.push(`ctx.strokeStyle = '${color}'`);
    paintSteps.push(`ctx.strokeText("${element.text.replace(/^\s+|\s+$/, '')}", ${left}, ${top + 20})`)
  } else {
    paintSteps.push(`ctx.fillStyle = '${background}'`)
    paintSteps.push(`ctx.fillRect(${ parseFloat(left)}, ${ parseFloat(top) }, ${ width }, ${ height })`)
  }
  element.children.forEach(child => paint(child, paintSteps))
  return paintSteps
}

function createLayoutTree(element) {
  element.children = element.children.filter(isShow)
  element.children.forEach(createLayoutTree)
  return element
}

function createLayerTree(element, layers) {
  // 遍历子节点，判断是否要生成新的图层，如果生成，则从当前图层中删除
  element.children = element.children.filter(child => createNewLayer(child, layers))
  element.children.forEach(child => createLayerTree(child, layers))
  return layers
}

function createNewLayer(element, layers) {
  let createdNewLayer = false
  const attributes = element.attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'style') {
      const attributes = value.split(/;\s*/)//[background: green;]
      attributes.forEach(attribute => {
        const [property, value] = attribute.split(/;\s*/)
      })
    }
  })
}

/**
 * 计算布局树上每个元素的布局信息
 * @param {*} element 
 * @param {*} top 
 * @param {*} parentTop 
 */
function updateLayoutTree(element, top = 0, parentTop = 0) {
  const computedStyle = element.computedStyle
  element.layout = {
    top: top + parentTop,
    left: 0,
    width: computedStyle.width,
    height: computedStyle.height,
    color: computedStyle.color
  }
  let childTop = 0
  element.children.forEach(child => {
    updateLayoutTree(child, childTop, element.layout.top)
    childTop += parseFloat(child.computedStyle.height || 0)
  })
}

function isShow(element) {
  let show = true // 默认都显示
  if (element.tagName === 'head' || element.tagName === 'script' || element.tagName === ['link']) {
    show = false;
  }
  const attributes = element.attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'style') {
      const attributes = value.split(/;\s*/)
      attributes.forEach(attribute => {
        const [property, value] = attribute.split(/;\s*/)
        // property && (element.computedStyle[property] = value)
        if (property === 'display' && value === 'none') {
          show = false
        }
      })
    }
  })
  return show
}

function recalculateStyle(cssRules, element, parentStyle = {}) {
  const attributes = element.attributes
  element.computedStyle = { // 样式继承
    color: parentStyle.color || 'black'
  }
  Object.entries(attributes).forEach(([key, value]) => {
    // 应用样式表
    cssRules.forEach(rule => {
      let selector = rule.selectors[0]
      if (key === 'id' && selector === '#' + value || key === 'class' && selector === '.' + value) {
        rule.declarations.forEach(({ property, value }) => {
          property && (element.computedStyle[property] = value)
        })
      }
    })
    // 行内样式
    if (key === 'style') {
      const attributes = value.split(/;\s*/) // background: green
      attributes.forEach(attribute => { // background: green
        const [property, value] = attribute.split('\s*:\s*') // ['background', 'green']
        property && (element.computedStyle[property] = value)
      })
    }
  })
  element.children.forEach(child => recalculateStyle(cssRules, child, element.computedStyle))
}
//GPU进程负责把图片光栅化，生成位图并保存到GPU内存里
gpu.on('raster', tile => {

})
// 1. 由主进程接收用户输入的URL地址
main.emit('request', {
  host,
  port,
  path: '/index.html'
})