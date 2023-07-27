export type Element = {
  begin: number;
  ender: number;
  lexer: string;
  lines: number;
  stack: string;
  token: string;
  types: string;
}

export const pivot = (data: data): Element[] => {
  return data.token.map((_: unknown, index: number): Element => {
    return {
      begin: data.begin[index],
      ender: data.ender[index],
      lexer: data.lexer[index],
      lines: data.lines[index],
      stack: data.stack[index],
      token: data.token[index],
      types: data.types[index],
    }
  });
}

export const depivot = (pivotData: Element[]): data => {
  return pivotData.reduce((acc: data, element: Element) => {
    acc.begin.push(element.begin);
    acc.ender.push(element.ender);
    acc.lexer.push(element.lexer);
    acc.lines.push(element.lines);
    acc.stack.push(element.stack);
    acc.token.push(element.token);
    acc.types.push(element.types);
    return acc;
  }, {begin: [], ender: [], lexer: [], lines: [], stack: [], token: [], types: []});
}
