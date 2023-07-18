import { pivot, depivot } from './pivot'

describe('pivot test', (): void => {
  test('pivot', (): void => {
    const data = {
      begin: [ 0, 0, 0],
      ender: [ 0, 0, 0],
      lexer: [ 'markup', 'markup', 'markup'],
      lines: [ 0, 0, 0],
      stack: [ 'global', 'div', 'div'],
      token: [
        '<div>',
        "hoge",
        '<span>',
      ],
      types: [ 'start', 'attribute', 'end' ]
    }

    const result = pivot(data);

    const expected = [
      {begin: 0, ender: 0, lexer: "markup", lines: 0, stack: "global", token: "<div>", types: "start"},
      {begin: 0, ender: 0, lexer: "markup", lines: 0, stack: "div", token: "hoge", types: "attribute"},
      {begin: 0, ender: 0, lexer: "markup", lines: 0, stack: "div", token: "<span>", types: "end"}
    ]

    expect(expected).toEqual(result);
  })

  test('depivot', (): void => {
    const data = [
      {begin: 0, ender: 0, lexer: "markup", lines: 0, stack: "global", token: "<div>", types: "start"},
      {begin: 0, ender: 0, lexer: "markup", lines: 0, stack: "div", token: "hoge", types: "attribute"},
      {begin: 0, ender: 0, lexer: "markup", lines: 0, stack: "div", token: "<span>", types: "end"}
    ];

    const result = depivot(data);

    const expected = {
      begin: [ 0, 0, 0],
      ender: [ 0, 0, 0],
      lexer: [ 'markup', 'markup', 'markup'],
      lines: [ 0, 0, 0],
      stack: [ 'global', 'div', 'div'],
      token: [
        '<div>',
        "hoge",
        '<span>',
      ],
      types: [ 'start', 'attribute', 'end' ]
    }

    expect(expected).toEqual(result);
  })
})
