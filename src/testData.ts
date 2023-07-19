import "sparser"

const parse = (html: string, language: string = "ejs"): data => {
  sparser.options.source = html;
  sparser.options.language = language;
  sparser.options.format = "objects";
  sparser.parser();
  return sparser.parse.data;
}

export { parse };

// console.log(parse('<div><%= name %></div>'));
// console.log(parse('<div><%- name %></div>'));
// console.log(parse('<div><%_ name _%></div>'));
// console.log(parse('<div><%# name %></div>'));
// console.log(parse('<div class=<%= name %>></div>'));
// console.log(parse('<div class="<%= name %>"></div>'));
// console.log(parse("<div hoge='hogehoge <%= name %>' fuga='fugafuga <%= name %>'></div>"));
// console.log(parse("<div style='hoge: fuga'></div>"));
// console.log(parse("<div style='<%= hoge %>'></div>"));
// console.log(parse('<div class=<%- name %>></div>'));
// console.log(parse('<div class=<%_ name _%>></div>'));
// console.log(parse('<div><% var name="hoge" %></div>'));
// console.log(parse('<div><% let name="hoge" %></div>'));
// console.log(parse('<div><% const name="hoge" %></div>'));
// console.log(parse('<div><% (function() {%></div>'));
// console.log(parse('<div><% (() => {%></div>'));
// console.log(parse('<div><% }%></div>'));
// console.log(parse('<div><% function hoge() {}%></div>'));
// console.log(parse('<div><% var name=() => {%></div>'));

console.log(parse(
`<area>
<base>
<br>
<col>
<embed>
<hr>
<iframe>
<img>
<input>
<link>
<meta>
<param>
<source>
<template>
<track>
<wbr>`));

