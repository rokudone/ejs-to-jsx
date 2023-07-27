import { getIndents, render } from './render'
import {pivot} from './pivot'

describe('render test', (): void => {
  test('first', (): void => {
    const parse = {
      begin: [ -1, 0, 0, 2, 2, 0 ],
      ender: [ 5, 5, 4, 4, 4, 5 ],
      lexer: [ 'markup', 'markup', 'markup', 'markup', 'markup', 'markup' ],
      lines: [ 0, 1, 0, 0, 0, 0 ],
      stack: [ 'global', 'div', 'div', 'span', 'span', 'div' ],
      token: [
        '<div>',
        'className="hello"',
        '<span>',
        '{hoge}',
        '</span>',
        '</div>'
      ],
      types: [ 'start', 'attribute', 'start', 'template', 'end', 'end' ]
    }

    const result = render(parse);

    expect(`<div className="hello"><span>{hoge}</span></div>`).toEqual(result);
  })

  test('text', (): void => {
    const parse = {
      begin: [
        -1, 0, 0, 2, 3,
        2, 5, 6, 7, 6,
        5
      ],
      ender: [
        -1, -1, -1, 4, 4,
        10,  9,  8, 8, 9,
        10
      ],
      lexer: [
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup',
        'markup'
      ],
      lines: [
        0, 1, 0, 0, 0,
        0, 0, 0, 0, 0,
        0
      ],
      stack: [
        'global', 'div',
        'div',    'ul',
        'li',     'ul',
        'ul',     'ol',
        'li',     'ol',
        'ul'
      ],
      token: [
        '<div>',  'className="hello"',
        '<ul>',   '<li>',
        '</li>',  '<ul>',
        '<ol>',   '<li>',
        '</li>',  '</ol>',
        '</div>'
      ],
      types: [
        'start', 'attribute',
        'start', 'start',
        'end',   'start',
        'start', 'start',
        'end',   'end',
        'end'
      ]
    }

    const result = render(parse);

    expect(`<div className="hello"><ul><li></li><ul><ol><li></li></ol></div>`).toEqual(result)
  })

  test('attribute', (): void => {
    const parse = {
      begin: [ -1, 0, 0 ],
      ender: [ 2, 2, 2 ],
      lexer: [ 'markup', 'markup', 'markup' ],
      lines: [ 0, 1, 0 ],
      stack: [ 'global', 'div', 'div' ],
      token: [ '<div>', 'className={name}', '</div>' ],
      types: [ 'start', 'template_attribute', 'end' ]
    }

    const result = render(parse);
  
    expect(`<div className={name}></div>`).toEqual(result);
  })

  test('div', () => {

    const data = {
      begin: [ -1, 0, 1, 1, 0, 4, 5, 5, 4, 0 ],
      ender: [ 9, 3, 3, 3, 8, 7, 7, 7, 8, 9 ],
      lexer: [ 'markup', 'markup', 'markup', 'markup', 'markup', 'markup', 'markup', 'markup', 'markup', 'markup' ],
      lines: [ 2, 2, 0, 0, 2, 2, 0, 0, 2, 2 ],
      stack: [
        'global', 'div', 'span', 'span', 'div',
        'div', 'span', 'span', 'div', 'div'
      ],
      token: [
        '<div>',
        '<span>', 'test', '</span>',
        '<div>',
        '<span>', 'test',  '</span>',
        '</div>',
        '</div>'
      ],
      types: [
        'start', 'start', 'content', 'end', 'start', 'start', 'content', 'end', 'end', 'end'
      ]
    };

    const expected = `
<div>
  <span>test</span>
  <div>
    <span>test</span>
  </div>
</div>`;

    const result = render(data);

    expect(expected).toEqual(result);
  });

  test('indent', () => {

    const data = {
      begin: [ -1, 0, 1, 1, 0, 4, 5, 5, 4, 0 ],
      ender: [ 9, 3, 3, 3, 8, 7, 7, 7, 8, 9 ],
      lexer: [ 'markup', 'markup', 'markup', 'markup', 'markup', 'markup', 'markup', 'markup', 'markup', 'markup' ],
      lines: [ 2, 2, 0, 0, 2, 2, 0, 0, 2, 2 ],
      stack: [
        'global', 'div', 'span', 'span', 'div',
        'div', 'span', 'span', 'div', 'div'
      ],
      token: [
        '<div>',
        '<span>', 'test', '</span>',
        '<div>',
        '<span>', 'test',  '</span>',
        '</div>',
        '</div>'
      ],
      types: [
        'start', 'start', 'content', 'end', 'start', 'start', 'content', 'end', 'end', 'end'
      ]
    };

    const expected = [0, 1, 2, 1, 1, 2, 3, 2, 1, 0]

    const result = getIndents(pivot(data));
    expect(expected).toEqual(result);
  });

  test('singleton', () => {
    const data = {
      begin: [ -1, 0 ],
      ender: [ -1, -1 ],
      lexer: [ 'markup', 'markup' ],
      lines: [ 0, 1 ],
      stack: [ 'global', 'input' ],
      token: [ '<input/>', 'class="fuga"' ],
      types: [ 'singleton', 'attribute' ]
    }

    const expected = '<input class="fuga"/>';

    const result = render(data);
    expect(expected).toEqual(result);
  });

  test('singleton indent', () => {

    const data = {
      begin: [ -1, 0, 0, 0 ],
      ender: [ 3, 3, 3, 3 ],
      lexer: [ 'markup', 'markup', 'markup', 'markup' ],
      lines: [ 2, 2, 2, 2 ],
      stack: [ 'global', 'div', 'div', 'div' ],
      token: [ '<div>', '<input/>', '<input/>', '</div>' ],
      types: [ 'start', 'singleton', 'singleton', 'end' ]
    };

    const expected = `
<div>
  <input/>
  <input/>
</div>`;

    const result = render(data);

    expect(expected).toEqual(result);
  });
});

