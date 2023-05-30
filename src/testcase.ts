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

export const add_1_2: PietImage = {
  width: 7,
  height: 5,
  getColor: (x, y): Color => {
    const colors: Array<[Array<[number, number]>, Color]> = [
      [
        [[0, 0], [5, 1], [5, 2], [5, 3]],
        { hue: 'red', brightness: 'light' }
      ],
      [
        [[1, 0], [1, 1]],
        { hue: 'red', brightness: 'normal' }
      ],
      [
        [[2, 0], [2, 1], [2, 2]],
        { hue: 'red', brightness: 'dark' }
      ],
      [
        [[3, 0], [3, 1], [3, 2], [4, 2]],
        { hue: 'yellow', brightness: 'dark' }
      ],
      [
        [[4, 1], [5, 0], [6, 1], [4, 3], [5, 4], [6, 3]],
        { hue: 'black' } satisfies Color
      ]
    ];
    for (let i = 0; i < colors.length; i++) {
      if (includeXY(colors[i][0], x, y)) {
        return colors[i][1];
      }
    }
    return { hue: 'white' };
  }
}