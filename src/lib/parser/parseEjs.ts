import "sparser"

const parseEjs = (html: string): data => {
  sparser.options.source = html;
  sparser.options.language = "ejs";
  sparser.options.format = "objects";
  sparser.parser();
  return sparser.parse.data;
}

export { parseEjs };
