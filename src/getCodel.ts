import { PietImage, Position } from '.';
import { isSameColor } from './color';
import { DP } from '../src/dp';
import { CC } from './cc';

// (x, y)の色から同じ色の範囲で、最もDP方向に進んでいる中で、DPに向かって最もCC方向の座標を探索
// とりあえず毎回深さ優先探索をする 最初に一度算出してキャッシュすれば高速化できる
export const getCodel = (image: PietImage, x: number, y: number, dp: DP, cc: CC): Position => {
  // DP方向の観点でaがbより奥にあるか
  // true = a is better than b
  const dpBetter = (a: Position, b: Position): boolean => {
    if (dp === 'right') {
      return a.x > b.x;
    } else if (dp === 'left') {
      return a.x < b.x;
    } else if (dp === 'down') {
      return a.y > b.y;
    } else { // dp === 'up'
      return a.y < b.y;
    }
  }
  // CC方向
  // true = a is better than b
  const ccBetter = (a: Position, b: Position): boolean => {
    if ((dp === 'right' && cc === 'left') || (dp === 'left' && cc === 'right')) {
      return a.y < b.y;
    } else if ((dp === 'right' && cc === 'right') || (dp === 'left' && cc == 'left')) {
      return a.y > b.y;
    } else if ((dp === 'up' && cc === 'right') || (dp === 'down' && cc === 'left')) {
      return a.x > b.x;
    } else {
      return a.x < b.x;
    }
  }

  const betterCodelPosition = (a: Position, b: Position): Position => {
    if (dpBetter(a, b)) {
      return a;
    } else if (dpBetter(b, a)) {
      return b;
    } else if (ccBetter(a, b)) {
      return a;
    } else {
      return b;
    }
  }

  // 引数の(x, y)から始めてCodelを探索する
  const stack: Array<[number, number]> = [[x, y]];
  let bestCodel: Position = { x, y };
  const color = image.getColor(x, y);
  if (color === undefined) {
    throw Error('the color of specified position is undefined');
  }
  const checked: Array<Array<boolean>> = [];
  for (let y = 0; y < image.height; y++) {
    checked.push(Array(image.width).fill(false));
  }

  while (stack.length > 0) {
    const top = stack.pop();
    if (top === undefined) { throw new Error("stack top is undefined") }
    const [sx, sy] = top;
    const moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    moves.forEach(([mx, my]) => {
      let ex = sx + mx;
      let ey = sy + my;
      if (ex < 0 || ex >= image.width || ey < 0 || ey >= image.height) {
        return;
      }
      if (!checked[ey][ex]) {
        checked[ey][ex] = true;
        const ecolor = image.getColor(ex, ey);
        if (ecolor === undefined) return;
        if (!isSameColor(color, ecolor)) return;

        stack.push([ex, ey]);
        bestCodel = betterCodelPosition(bestCodel, { x: ex, y: ey });
      }
    })
  }

  return bestCodel;
}