import { parse } from './parse';
import { replace } from './replace';
import { render } from './render';

export const convert = (html: string) => {
  const parsed = parse(html);
  const replaced = replace(parsed);
  return render(replaced);
}
