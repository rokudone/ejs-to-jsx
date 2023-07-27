#!/usr/bin/env node

import { convert } from './lib/convert';
import fs from 'fs';

if (process.argv.length < 3) {
  console.log('Usage: jsx-to-component <file>');
  process.exit(1);
}

const file = fs.readFileSync(process.argv[2], 'utf8');
console.log(convert(file));
