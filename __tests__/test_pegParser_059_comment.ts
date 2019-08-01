import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`;`以降がコメントとなること', () => {
  expect(parse('; comment')[0]).toMatchObject({
    type: MmlType.COMMENT,
    value: { comment: '; comment' },
  });
  expect(parse(';;; comment')[0]).toMatchObject({
    type: MmlType.COMMENT,
    value: { comment: ';;; comment' },
  });
  expect(parse('; comment ; comment')[0]).toMatchObject({
    type: MmlType.COMMENT,
    value: { comment: '; comment ; comment' },
  });
  expect(parse('_; comment')[1]).toMatchObject({
    type: MmlType.COMMENT,
    value: { comment: '; comment' },
  });
});
