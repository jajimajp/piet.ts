import { PietImage, isSameColor } from ".";

// 指定された座標から同じ色で到達できる範囲のカラーブロックの面積
export const getColorBlockValue = (image: PietImage, x: number, y: number): number => {
  const color = image.getColor(x, y);
  if (color === undefined) {
    throw Error('the color of specified position is undefined');
  }
  const checked: Array<Array<boolean>> = [];
  for (let y = 0; y < image.height; y++) {
    checked.push(Array(image.width).fill(false));
  }

  let stack: Array<[number, number]> = [[x, y]];
  checked[y][x] = true;
  let area = 1;
  const moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (stack.length > 0) {
    const top = stack.pop();
    if (top === undefined) { throw Error('stack top is undefined')}
    const [sx, sy] = top;
    moves.forEach(([mx, my]) => {
      const ex = sx + mx;
      const ey = sy + my;
      if (ex < 0 || ex >= image.width || ey < 0 || ey >= image.height) {
        return;
      }
      if (!checked[ey][ex]) {
        checked[ey][ex] = true;
        const c = image.getColor(ex, ey);
        if (c === undefined) { return; }
        if (isSameColor(color, c)) {
          stack.push([ex, ey]);
          area++;
        }
      }
    })
  }

  return area;
}