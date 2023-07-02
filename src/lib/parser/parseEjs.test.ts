import { parseEjs } from './parseEjs'

describe('parseEjs test', (): void => {
  test('text', (): void => {
    const result = parseEjs(`<div class='hello'><span><%= hoge %></span></div>`);

    console.log(result);

    expect(result.token).toEqual(expect.arrayContaining([
      "<div>",
      "class='hello'",
      "<span>",
      "<%= hoge %>",
      "</span>",
      "</div>"
      ]))
  })
})

