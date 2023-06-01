import fs from 'fs';
import { readPiet } from '../src/readPiet';
import { getColorBlockValue } from '../src/getColorBlockValue';

test('getCodel', () => {
  const src = fs.readFileSync('./testcase/out1.piet').toString();
  const image = readPiet(src);
  expect(getColorBlockValue(image, 1, 1)).toBe(4);
});
