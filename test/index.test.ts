import fs from 'fs';
import { readPiet } from '../src/readPiet';
import { PietInterpreter } from '../src';

test('code: print 1', () => {
  const src = fs.readFileSync('./testcase/out1.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run()).toStrictEqual({ stack: [], output: "1" });
})

test('code: push 4', () => {
  const src = fs.readFileSync('./testcase/push4.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run()).toStrictEqual({ stack: [4], output: "" });
})

test('code: pop 1', () => {
  const src = fs.readFileSync('./testcase/pop1.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [1, 2]);
  expect(it.run()).toStrictEqual({ stack: [1], output: "" });
})

test('code: print 1 + 2', () => {
  const src = fs.readFileSync('./testcase/print_add_1_2.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run()).toStrictEqual({ stack: [], output: "3" });
})

test('code: add 1 1', () => {
  const src = fs.readFileSync('./testcase/add.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [1, 1]);
  expect(it.run()).toStrictEqual({ stack: [2], output: ""  });
})

test('code: subtract 2 1', () => {
  const src = fs.readFileSync('./testcase/subtract.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [2, 1]);
  expect(it.run()).toStrictEqual({ stack: [1], output: "" });
})

test('code: multiply 2 3', () => {
  const src = fs.readFileSync('./testcase/multiply.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [2, 3]);
  expect(it.run()).toStrictEqual({ stack: [6], output: "" });
})

test('code: divide 6 2', () => {
  const src = fs.readFileSync('./testcase/divide.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [6, 2]);
  expect(it.run()).toStrictEqual({ stack: [3], output: "" });
})

test('code: divide 5 2 = 2', () => {
  const src = fs.readFileSync('./testcase/divide.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [5, 2]);
  expect(it.run()).toStrictEqual({ stack: [2], output: "" });
})

test('code: mod 5 2 = 1', () => {
  const src = fs.readFileSync('./testcase/mod.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [5, 2]);
  expect(it.run()).toStrictEqual({ stack: [1], output: "" });
})

test('code: mod -4 3 = 2', () => {
  // see https://www.dangermouse.net/esoteric/piet.html
  const src = fs.readFileSync('./testcase/mod.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [-4, 3]);
  expect(it.run()).toStrictEqual({ stack: [2], output: "" });
})

test('code: not 2 = 0', () => {
  const src = fs.readFileSync('./testcase/not.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [2]);
  expect(it.run()).toStrictEqual({ stack: [0], output: "" });
})

test('code: not 0 = 1', () => {
  const src = fs.readFileSync('./testcase/not.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [0]);
  expect(it.run()).toStrictEqual({ stack: [1], output: "" });
})

test('code: greater [0, 1]', () => {
  const src = fs.readFileSync('./testcase/greater.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [0, 1]);
  expect(it.run()).toStrictEqual({ stack: [0], output: "" });
})

test('code: greater [1, 0]', () => {
  const src = fs.readFileSync('./testcase/greater.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [1, 0]);
  expect(it.run()).toStrictEqual({ stack: [1], output: "" });
})

// TODO: tests for pointer, switch

test('code: duplicate [1]', () => {
  const src = fs.readFileSync('./testcase/duplicate.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [1]);
  expect(it.run()).toStrictEqual({ stack: [1, 1], output: "" });
})

test('code: roll [1, 2, 3, 4, 3, 2]', () => {
  const src = fs.readFileSync('./testcase/roll.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [1, 2, 3, 4, 3, 2]);
  expect(it.run()).toStrictEqual({ stack: [1, 3, 4, 2], output: "" });
})

test('code: in(number)', () => {
  const src = fs.readFileSync('./testcase/in_num.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run("023A")).toStrictEqual({ stack: [23], output: "" });
})

test('code: in(char)', () => {
  const src = fs.readFileSync('./testcase/in_char.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run("A")).toStrictEqual({ stack: [65], output: "" });
})

test('code: in(num) => in(char)', () => {
  const src = fs.readFileSync('./testcase/innum_inchar.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run("026A")).toStrictEqual({ stack: [26, 65], output: "" });
})

test('code: out(number)', () => {
  const src = fs.readFileSync('./testcase/out_num.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [1]);
  expect(it.run()).toStrictEqual({ stack: [], output: "1" });
})

test('code: out(char)', () => {
  const src = fs.readFileSync('./testcase/out_char.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image, [65]);
  expect(it.run()).toStrictEqual({ stack: [], output: "A" });
})

test('helloworld', () => {
  const src = fs.readFileSync('./testcase/helloworld.piet').toString();
  const image = readPiet(src);
  const it = new PietInterpreter(image);
  expect(it.run().output).toBe('Hello, world!\n');
})