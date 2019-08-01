import * as fs from 'fs';
import * as path from 'path';

import { formatSyntaxError, parse } from '../src/parse/parse';

describe('parse', () => {
  test('パース結果がスナップショットに一致すること', () => {
    const all = fs.readFileSync(
      path.resolve(__dirname, 'fixtures', 'all.mml'),
      'utf8',
    );

    expect(parse(all)).toMatchSnapshot();
  });
});

describe('formatSyntaxError', () => {
  test('SyntaxErrorの整形結果がスナップショットに一致すること', () => {
    const mmlBase: string[] = [
      '; 1',
      '; 2',
      '; 3',
      '; 4',
      'c4+',
      '; 5',
      '; 6',
      '; 7',
      '; 8',
    ];
    const mml1 = mmlBase.join('\n');
    const mml2 = mmlBase.slice(4).join('\n');
    const mml3 = mmlBase.slice(0, 5).join('\n');

    expect.assertions(3);
    try {
      parse(mml1);
    } catch (er) {
      expect(formatSyntaxError(mml1, er)).toMatchSnapshot();
    }
    try {
      parse(mml2);
    } catch (er) {
      expect(formatSyntaxError(mml2, er)).toMatchSnapshot();
    }
    try {
      parse(mml3);
    } catch (er) {
      expect(formatSyntaxError(mml3, er)).toMatchSnapshot();
    }
  });
});
