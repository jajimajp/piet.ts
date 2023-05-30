import fs from 'fs';
import { readPiet } from './src/readPiet';
import { PietInterpreter } from './src';

test('code: print 1', () => {
  const src = fs.readFileSync('./testcase/out1.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run()).toStrictEqual({ stack: [], output: "1" });
})

test('code: print 1 + 2', () => {
  const src = fs.readFileSync('./testcase/add_1_2.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run()).toStrictEqual({ stack: [], output: "3" });
})