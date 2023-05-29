import { PietImage, Color } from './index';

const includeXY = (arr: Array<[number, number]>, x: number, y: number) => {
  return arr.some(([ax, ay]) => ax === x && ay === y);
}
// 1を表示するPiet入力
export const print1: PietImage = {
  width: 5,
  height: 5,
  getColor: (x, y): Color => {
    if (x === 0 && y === 0) {
      return { hue: 'red', brightness: 'light' };
    } else if (
      includeXY([[1, 0], [1, 1], [1, 2], [2, 2]], x, y) 
    ) {
      return { hue: 'red', brightness: 'normal' };
    } else if (
      includeXY([[3, 1], [3, 2], [3, 3]], x, y)
    ) {
      return { hue: 'magenta', brightness: 'dark' };
    } else if (
      includeXY([[2, 1], [3, 0], [4, 1], [2, 3], [3, 4], [4, 3]], x, y)
    ) {
      return { hue: 'black' };
    } else {
      return { hue: 'white' };
    }
  }
}