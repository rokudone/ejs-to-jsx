export const convert = (jsx: string) => {
  const isSingleRoot = jsx.split("\n").filter((line: string) => line.substr(0, 1) !== " ").length === 2;

  const indentWidth = 2;
  const indentCount = 2;

  const baseIndent = " ".repeat(indentWidth).repeat(indentCount);

  const result =
`import React from 'react';

export const Presenter = () => {
  return (${isSingleRoot ? "" : "\n" + baseIndent + "<div>"}
${jsx.split("\n").map((line: string) => `${baseIndent}${isSingleRoot ? "" : " ".repeat(indentWidth)}${line}`).join("\n")}
${isSingleRoot ? "" : baseIndent + "</div>\n"}  )
};`
  return result;
}
