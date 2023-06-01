export type DP = 'right' | 'left' | 'up' | 'down';

// clockwise
export const nextDP = (dp: DP) => {
  switch (dp) {
    case 'right':
      return 'down';
    case 'down':
      return 'left';
    case 'left':
      return 'up';
    case 'up':
      return 'right';
  }
}

// anticlockwise
export const previousDP = (dp: DP) => {
  switch (dp) {
    case 'right':
      return 'up';
    case 'down':
      return 'right';
    case 'left':
      return 'down';
    case 'up':
      return 'left';
  }
}

// rotates the DP clockwise that many steps (anticlockwise if negative).
// TODO: 整数に変換して剰余を取れば高速化できる
export const rotateDP = (curr: DP, amount: number): DP => {
  if (amount === 0) { return curr }
  else if (amount < 0) { return rotateDP(previousDP(curr), amount + 1) }
  else /* amount > 0 */ { return rotateDP(nextDP(curr), amount - 1) }
}
