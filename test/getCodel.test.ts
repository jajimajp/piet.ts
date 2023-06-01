import fs from 'fs';
import { getCodel } from '../src/getCodel';
import { readPiet } from '../src/readPiet';

test('getCodel', () => {
  const src = fs.readFileSync('./testcase/out1.piet').toString();
  const image = readPiet(src);
  expect(getCodel(image, 1, 0, 'right', 'left')).toStrictEqual({ x: 2, y: 2 });
});