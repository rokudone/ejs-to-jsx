import { parse } from './parse'

describe('parse test', (): void => {
  test('text', (): void => {
    const result = parse(`<div class='hello'><span><%= hoge %></span></div>`);

    expect(expect.arrayContaining([
      "<div>",
      "class='hello'",
      "<span>",
      "<%= hoge %>",
      "</span>",
      "</div>"
      ])).toEqual(result.token)
  })

  test('text', (): void => {
    const result = parse(`<div class='hello'><ul><li></li><ul><ol><li></li></ol></div>`);

    expect(expect.arrayContaining([
      "<div>",
      "class='hello'",
      "<ul>",
      "<li>",
      "</li>",
      "<ul>",
      "<ol>",
      "<li>",
      "</li>",
      "</ol>",
      "</div>",
      ])).toEqual(result.token)
  })

})

