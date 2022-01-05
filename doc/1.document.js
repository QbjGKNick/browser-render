const doc = {
  type: 'document',
  attributes: {},
  children: [
    {
      type: 'element',
      tagName: 'html',
      children: [
        {
          type: 'text',
          tagName: 'text',
          children: [],
          text: '\n',
          attributes: {}
        },
        {
          type: 'element',
          tagName: 'body',
          children: [
            {
              type: 'text',
              tagName: 'text',
              children: [],
              text: '\n  ',
              attributes: {}
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
                  attributes: {}
                }
              ],
              attributes: { id: 'hello', style: 'background: green;' }
            },
            {
              type: 'text',
              tagName: 'text',
              children: [],
              text: '\n  ',
              attributes: {}
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
                  attributes: {}
                }
              ],
              attributes: { class: 'world', style: 'background: red;' }
            },
            {
              type: 'text',
              tagName: 'text',
              children: [],
              text: '\n',
              attributes: {}
            }
          ],
          attributes: {}
        },
        {
          type: 'text',
          tagName: 'text',
          children: [],
          text: '\n',
          attributes: {}
        }
      ],
      attributes: {}
    }
  ]
}