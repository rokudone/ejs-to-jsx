#!/usr/bin/env node

import { convertEjsToTsx } from './converter/convertEjsToTsx';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Please provide a path to the ejs file');
} else {
  console.log(convertEjsToTsx(args[0]));
}
