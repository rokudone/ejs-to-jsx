#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { convert } from './lib/convert';

if (process.argv.length < 3) {
  console.log('Usage: ejs-to-jsx <file> <dest>');
  process.exit(1);
}

const file = fs.readFileSync(process.argv[2], 'utf8');
const dest = process.argv?.[3] || path.join(path.dirname(process.argv[2]), path.basename(process.argv[2], '.ejs') + '.jsx');

fs.writeFileSync(dest, convert(file));
