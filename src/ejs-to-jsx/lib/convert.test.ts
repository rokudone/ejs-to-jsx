import { convert } from './convert';

describe('convert', () => {

  test('export', () => {
    const result = convert('<div><%= name %></div>');

    const expected = '<div>{ name }</div>';

    expect(expected).toEqual(result);
  });

  test('unescaped', () => {
    const result = convert('<div><%- name %></div>');

    const expected = '<div><div dangerouslySetInnerHTML={{ __html: (name) }} /></div>';

    expect(expected).toEqual(result);
  });

  test('basic args', () => {
    const result = convert('<div class="<%= name %>"></div>');

    const expected = '<div className={name}></div>';

    expect(expected).toEqual(result);
  });

  test('unescaped args', () => {
    const result = convert('<div class="<%- name %>"></div>');

    const expected = '<div className={name}></div>';

    expect(expected).toEqual(result);
  });

  test('style', () => {
    const result = convert( '<div style="display: inline; border: 1px solid black;"></div>');

    const expected = '<div style={{display: "inline", border: "1px solid black",}}></div>';

    expect(expected).toEqual(result);
  });

  test('map', () => {
    const result = convert( `
<div>
  <ul class="hoge">
    <% ['test'].map((name) => { %>
      <li><%= name %></li>
    <% }) %>
  </ul>
</div>`);

    const expected = `
<div>
  <ul className="hoge">
    {['test'].map((name) => {
      return (
        <li>{ name }</li>
      )
    })}
  </ul>
</div>`;

    expect(expected).toEqual(result);
  });

  test('singleton', () => {
    const result = convert(`
<div>
  <input>
  <input>
  <input>
</div>`);

    const expected =`
<div>
  <input/>
  <input/>
  <input/>
</div>`;

    expect(expected).toEqual(result);
  })
});
