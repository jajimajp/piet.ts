import { Color, colorDiff } from '../src/color';

test('colorDiff', () => {
  const a: Color = { hue: 'red', lightness: 'light' };
  const b: Color = { hue: 'yellow', lightness: 'normal' };
  expect(colorDiff(a, b)).toStrictEqual({ hueDiff: 1, lightnessDiff: 1 });
  expect(colorDiff(b, a)).toStrictEqual({ hueDiff: 5, lightnessDiff: 2 });
})