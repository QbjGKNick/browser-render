const EventEmitter = require('events')
class Gpu extends EventEmitter {
  constructor() {
    super()
    // 我们最终会把生成的位图保存在GPU的内存里
  }
}

const gpu = new Gpu()
module.exports = gpu