import convert from 'html-to-jsx';
export const convertViewToTsx = (rawText: string) => {
  return convert(rawText);
}

