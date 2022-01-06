const style = {
  type: 'document',
  attributes: {},
  children: [
    {
      type: 'element',
      tagName: 'html',
      children: [
        {
          type: 'element',
          tagName: 'head',
          children: [
            {
              type: 'text',
              tagName: 'text',
              children: [],
              text: '\r\n  ',
              attributes: {},
              computedStyle: { color: 'black' }
            },
            {
              type: 'element',
              tagName: 'style',
              children: [
                {
                  type: 'text',
                  tagName: 'text',
                  children: [],
                  text: '\r\n' +
                    '    #hello {\r\n' +
                    '      color: red;\r\n' +
                    '    }\r\n' +
                    '\r\n' +
                    '    .world {\r\n' +
                    '      color: green;\r\n' +
                    '    }\r\n' +
                    '  ',
                  attributes: {},
                  computedStyle: { color: 'black' }
                }
              ],
              attributes: {},
              computedStyle: { color: 'black' }
            }
          ],
          attributes: {},
          computedStyle: { color: 'black' }
        },
        {
          type: 'element',
          tagName: 'body',
          children: [
            {
              type: 'text',
              tagName: 'text',
              children: [],
              text: '\r\n  ',
              attributes: {},
              computedStyle: { color: 'black' }
            },
            {
              type: 'element',
              tagName: 'div',
              children: [
                {
                  type: 'text',
                  tagName: 'text',
                  children: [],
                  text: 'hello',
                  attributes: {},
                  computedStyle: { color: 'red' }
                }
              ],
              attributes: { id: 'hello', style: 'background-color: green;' },
              computedStyle: {
                color: 'red', 'background-color: green': undefine
d
              }
            },
            {
              type: 'text',
              tagName: 'text',
              children: [],
              text: '\r\n  ',
              attributes: {},
              computedStyle: { color: 'black' }
            },
            {
              type: 'element',
              tagName: 'div',
              children: [
                {
                  type: 'text',
                  tagName: 'text',
                  children: [],
                  text: 'world',
                  attributes: {},
                  computedStyle: { color: 'green' }
                }
              ],
              attributes: { class: 'world', style: 'background-color: red;' },
              computedStyle: {
                color: 'green', 'background-color: red': undefine
d
              }
            }
          ],
          attributes: {},
          computedStyle: { color: 'black' }
        }
      ],
      attributes: {},
      computedStyle: { color: 'black' }
    }
  ],
  computedStyle: { color: 'black' }
}