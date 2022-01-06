const layout = {
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
      computedStyle: { color: 'red', 'background-color: green': undefined }
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
      attributes: { class: 'world', style: 'display: none;' },
      computedStyle: { color: 'green', 'display: none': undefined }
    }
  ],
  attributes: {},
  computedStyle: { color: 'black' }
}
