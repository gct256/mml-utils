import { readFileSync } from 'fs';
import { resolve } from 'path';
import { inspect } from 'util';

import {
  formatSyntaxError,
  parse,
  translate,
  translators,
  filters,
} from '../src';

const bufferToHex = (buffer: Buffer): string => {
  const array = Array(8).fill('  ');

  Array.from(buffer).forEach((x: number, i: number) => {
    array[i] = `0${x.toString(16)}`.slice(-2);
  });

  return array.join(' ');
};

const bufferToChar = (buffer: Buffer): string => {
  const array = Array(8).fill(' ');

  Array.from(buffer).forEach((x: number, i: number) => {
    if (x >= 0x20 && x <= 0x7e) {
      array[i] = String.fromCharCode(x);
    } else {
      array[i] = '.';
    }
  });

  return array.join('');
};

const hexSep = (): void => {
  console.debug(
    '-----+--------------------------------------------------+-------------------+',
  );
  console.debug(
    '     | +0 +1 +2 +3 +4 +5 +6 +7  +8 +9 +A +B +C +D +E +F | 01234567 89ABCDEF |',
  );
  console.debug(
    '-----+--------------------------------------------------+-------------------+',
  );
};

const hexDump = (buffer: Buffer): void => {
  console.debug('');
  hexSep();

  for (let i = 0; i < buffer.length; i += 16) {
    console.debug(
      `000${i.toString(16)}`.slice(-4),
      '|',
      bufferToHex(buffer.slice(i, i + 8)),
      '',
      bufferToHex(buffer.slice(i + 8, i + 16)),
      '|',
      bufferToChar(buffer.slice(i, i + 8)),
      bufferToChar(buffer.slice(i + 8, i + 16)),
      '|',
    );

    if (i % 256 === 255) hexSep();
  }

  if ((buffer.length - 1) % 256 !== 255) hexSep();
  console.debug('');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dump = (x: any): void => {
  console.debug('-'.repeat(40));

  if (typeof x === 'string') {
    console.debug(x);
  } else if (x instanceof Buffer) {
    hexDump(x);
  } else {
    console.debug(inspect(x, { depth: null }));
  }
};

const mml = readFileSync(resolve(__dirname, 'example.mml'), 'utf8');

try {
  const parsed = parse(mml);
  const result1 = translate(
    parsed,
    translators.jsObject({
      makeFilters() {
        return [filters.validate()];
      },
    }),
  );

  dump(result1);
} catch (er) {
  console.error(formatSyntaxError(mml, er));
}
