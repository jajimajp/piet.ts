// 1を表示するPiet入力
export const print1: PietImage = {
  width: 5,
  height: 5,
  getColor: (x, y): Color => {
    if (x === 0 && y === 0) {
      return { hue: 'red', brightness: 'light' };
    } else if (
      [[1, 0], [1, 1], [1, 2], [2, 2]].includes([x, y]) 
    ) {
      return { hue: 'red', brightness: 'normal' };
    } else if (
      [[3, 1], [3, 2], [3, 3]].includes([x, y])
    ) {
      return { hue: 'magenta', brightness: 'dark' };
    } else if (
      [[2, 1], [3, 0], [4, 1], [2, 3], [3, 4], [4, 3]].includes([x, y])
    ) {
      return { hue: 'black' };
    } else {
      return { hue: 'white' };
    }
  }
}