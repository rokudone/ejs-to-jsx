import {Element, pivot} from "./pivot"

const indentWidth = 2;

const render = (data: data): string => {
  const pivotData = pivot(data);

  const indents = getIndents(pivotData);

  const html = pivotData.reduce((acc: string, element: Element, index: number) => {
    return addElement(acc, element, index, indents);
  }, "");

  return html
}

const getIndents = (elements: Element[]) => {
  const indents = elements.map((_: unknown) => -1);

  let indent = 0;

  elements.forEach((element: Element, index: number) => {
    if (/end/.test(element.types)) {
      // endタグであれば、インデントを一個減らす
      indent--;
    }

    indents[index] = indent;

    if (/start/.test(element.types)) {
      // startタグであれば、インデントを一個増やす
      indent++;
    }
  });

  return indents;
}

const addElement = (
  html: string,
  element: Element,
  index: number,
  indents: number[]
): string => {
  let result = html;
  let matched = "";

  if (isAttribute(element)) {
    matched = result.match(/\/?>$/)?.[0] as string;
    result = result.replace(/\/?>$/, "");
  }


  if (element.lines === 1) {
    result += " ";
  } else if (element.lines >= 2) {
    for (let i = 1; i < element.lines; i++) {
      result += "\n";
    }
    result += " ".repeat(indents[index] * indentWidth);
  }

  result += element.token;

  if (isAttribute(element)) {
    // 行末に`>`を追加
    result += matched;
  }

  return result;
}

const isAttribute = (element: Element) => {
  return element.types === "attribute" || element.types === "template_attribute";
}

export { render, getIndents };


