#!/usr/bin/env -S npx tsx

import { parseArgs } from 'node:util';
import { isFile } from '$lib/files';
import path from 'path';
import { fileURLToPath } from 'url';

const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
    short: 'b',
  },
};

const {
  values,
  positionals,
} = parseArgs({ options, allowPositionals: true });

const commandRoot = (positionals.length > 0) ? path.join(...positionals) : '.';
const commandPath = path.join(commandRoot, `index.ts`);

// Check if the command file exists
const fullPath = path.join(path.dirname(fileURLToPath(import.meta.url)), commandPath);
if (await isFile(fullPath)) {
  console.log(`Executing command: ${commandPath}`);
  try {
    console.log({ fullPath });
    const commandModule = await import(fullPath);
    if (typeof commandModule.default === 'function') {
      await commandModule.default(values);
    } else {
      console.error(`Command ${commandPath} does not export a default function.`);
    }
  } catch (error) {
    console.error(`Error executing command ${commandPath}:`, error);
  }
} else {
  console.error(`Command not found: ${commandPath}`);
}