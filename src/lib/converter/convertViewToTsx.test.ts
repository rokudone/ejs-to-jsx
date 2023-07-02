import { convertViewToTsx } from './convertViewToTsx'

describe('convertViewToTsx test', (): void => {
  test('simpleText', (): void => {
    const response = convertViewToTsx('<div class="hello">hello world</div>')
    expect(response).toBe('<div className="hello">hello world</div>')
  });

  test('multiLine', (): void => {
    const response = convertViewToTsx(`
<div class="hello">
  <span>hello world</span>
</div>
`)
    expect(response).toBe(`
<div className="hello">
  <span>hello world</span>
</div>
`)
  });

  test('likeJSX', (): void => {
    const response = convertViewToTsx(`
<div class="hello">
  {hoge}
</div>
`)
    expect(response).toBe(`
<div className="hello">
  {hoge}
</div>
`)
  });
})

