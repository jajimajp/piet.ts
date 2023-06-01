import { getCodel } from './getCodel';
import { getColorBlockValue } from './getColorBlockValue';

const hues = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'black', 'white'] as const;
export type Hue = typeof hues[number];
const brightnesses = ['light', 'normal', 'dark'] as const;
export type Brightness = typeof brightnesses[number];
export type Direction = 'right' | 'down' | 'left' | 'up';
export type LR = 'left' | 'right';

// clockwise
const nextDP = (dp: Direction) => {
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
const previousDP = (dp: Direction) => {
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
const rotateDP = (curr: Direction, amount: number): Direction => {
  if (amount === 0) { return curr }
  else if (amount < 0) { return rotateDP(previousDP(curr), amount + 1) }
  else /* amount > 0 */ { return rotateDP(nextDP(curr), amount - 1) }
}

const rollStack = (stack: number[], depth: number, roll: number): number[] => {
  const indexFor = (i: number) => {
    const dir = roll > 0 ? -1 : 1;
    if (i < stack.length - depth) {
      return i;
    } else {
      return (((dir * roll) + i - (stack.length - depth)) % depth + depth) % depth + (stack.length - depth);
      // TODO: cleanup
    }
  }
  return stack.map((_, i) => stack[indexFor(i)]);
}

const toggleCC = (curr: LR) => curr === 'left' ? 'right' : 'left';
// 計算量改善の余地あり
const toggleCCTimes = (curr: LR, times: number): LR =>
  times < 0 ? toggleCCTimes(curr, -times)
            : times === 0 ? curr : toggleCCTimes(toggleCC(curr), times - 1);

export interface Position {
  x: number;
  y: number;
}

export type Color = {
  hue: Exclude<Hue, 'black' | 'white'>;
  brightness: Brightness;
} | {
  // blackとwhiteのユニオンとして書くと型ガードが効かない
  hue: 'black';
} | {
  hue: 'white';
}

export const isSameColor = (a: Color, b: Color): boolean => {
  if (a.hue !== b.hue) {
    return false;
  } else if (a.hue === 'black' || a.hue === 'white') {
    return true;
  } else {
    if (b.hue === 'black' || b.hue === 'white') {
      throw Error('this code should not be executed');
    }
    return a.brightness === b.brightness
  }
}

export interface PietImage {
  width: number;
  height: number;
  getColor: (x: number, y: number) => Color | undefined;
}

export class PietInterpreter {
  private x: number;
  private y: number;
  private dp: Direction;
  private cc: LR;
  private previousCodelSize: number;
  private input: string;
  private output: string;
  private inputIndex: number;

  constructor(private image: PietImage, private stack: number[] = []) {
    this.x = 0;
    this.y = 0;
    this.dp = 'right';
    this.cc = 'left';
    this.previousCodelSize = 0;
    this.input = '';
    this.output = '';
    this.inputIndex = 0;
  }

  private static colorDifference(from: Color, to: Color): [number, number] {
    if (from.hue === 'black' || from.hue === 'white' || to.hue === 'black' || to.hue === 'white') {
      throw Error('TODO: black and white is currently not supported.');
    }
    const hueDiff = hues.indexOf(to.hue) - hues.indexOf(from.hue);
    const brightnessDiff = brightnesses.indexOf(to.brightness) - brightnesses.indexOf(from.brightness);
    return [
      (hueDiff + hues.length - 2) % (hues.length - 2), // white, blackを除く
      (brightnessDiff + brightnesses.length) % brightnesses.length,
    ];
  }

  private move(): void {
    let newX = this.x,  newY = this.y;
    if (this.dp === 'right') {
      newX++;
    } else if (this.dp === 'down') {
      newY++;
    } else if (this.dp === 'left') {
      newX--;
    } else if (this.dp === 'up') {
      newY--;
    }
    if (this.image.getColor(newX, newY) === undefined) {
      throw Error('edge is curreltly not supported');
    }
    if (this.image.getColor(newX, newY)?.hue === 'white') {
      throw Error('white is curreltly not supported');
    }
    if (this.image.getColor(newX, newY)?.hue === 'black') {
      throw Error('black is curreltly not supported');
    }
    const newPos = getCodel(this.image, newX, newY, this.dp, this.cc);
    this.x = newPos.x;
    this.y = newPos.y;
  }

  private executeCommand(from: Color, to: Color): void {
    const [hueDiff, lightnessDiff] = PietInterpreter.colorDifference(from, to);

    if (hueDiff === 0 && lightnessDiff === 1) { // push
      this.stack.push(this.previousCodelSize);
    } else if (hueDiff === 0 && lightnessDiff === 2) { // pop
      this.stack.pop();
    } else if (hueDiff === 1 && lightnessDiff === 0) { // add
      if (this.stack.length >= 2) {
        const op1 = this.stack[this.stack.length - 1];
        const op2 = this.stack[this.stack.length - 2];
        this.stack.splice(this.stack.length - 2, 2, op1 + op2);
      }
    } else if (hueDiff === 1 && lightnessDiff === 1) { // subtract
      if (this.stack.length >= 2) {
        const top = this.stack[this.stack.length - 1];
        const top2 = this.stack[this.stack.length - 2];
        this.stack.splice(this.stack.length - 2, 2, top2 - top);
      }
    } else if (hueDiff === 1 && lightnessDiff === 2) { // multiply
      if (this.stack.length >= 2) {
        const op1 = this.stack[this.stack.length - 1];
        const op2 = this.stack[this.stack.length - 2];
        this.stack.splice(this.stack.length - 2, 2, op1 * op2);
      }
    } else if (hueDiff === 2 && lightnessDiff === 0) { // divide
      if (this.stack.length >= 2) {
        const top = this.stack[this.stack.length - 1];
        const top2 = this.stack[this.stack.length - 2];
        if (top2 !== 0) {
          this.stack.splice(this.stack.length - 2, 2, Math.floor(top2 / top));
        }
        // ↑ (仕様より) If a divide by zero occurs, it is handled as an implementation-dependent error,
        // though simply ignoring the command is recommended.
      }
    } else if (hueDiff === 2 && lightnessDiff === 1) { // mod
      if (this.stack.length >= 2) {
        const top = this.stack[this.stack.length - 1];
        const top2 = this.stack[this.stack.length - 2];
        if (top2 !== 0) {
          // see https://www.dangermouse.net/esoteric/piet.html
          const mod = (top2 % top + top) % top;
          this.stack.splice(this.stack.length - 2, 2, mod);
        }
        // ↑ (仕様より) If a divide by zero occurs, it is handled as an implementation-dependent error,
        // though simply ignoring the command is recommended.
      }
    } else if (hueDiff === 2 && lightnessDiff === 2) { // not
      if (this.stack.length >= 1) {
        this.stack[this.stack.length - 1] = 
          this.stack[this.stack.length - 1] === 0 ? 1 : 0;
      }
    } else if (hueDiff === 3 && lightnessDiff === 0) { // greater
      if (this.stack.length >= 2) {
        const top = this.stack[this.stack.length - 1];
        const top2 = this.stack[this.stack.length - 2];
        this.stack.splice(this.stack.length - 2, 2, (top < top2 ? 1 : 0));
      }
    } else if (hueDiff === 3 && lightnessDiff === 1) { // pointer
      const amount = this.stack.pop();
      if (amount !== undefined) {
        this.dp = rotateDP(this.dp, amount);
      }
    } else if (hueDiff === 3 && lightnessDiff === 2) { // switch
      const amount = this.stack.pop();
      if (amount !== undefined) {
        this.cc = toggleCCTimes(this.cc, amount);
      }
    } else if (hueDiff === 4 && lightnessDiff === 0) { // duplicaate
      const top = this.stack.pop();
      if (top !== undefined) {
        this.stack.push(top, top);
      }
    } else if (hueDiff === 4 && lightnessDiff === 1) { // roll
      if (this.stack.length >= 2) {
        const top = this.stack.pop();
        const top2 = this.stack.pop();
        if (top && top2) {
          this.stack = rollStack(this.stack, top2, top);
        }
      }
    } else if (hueDiff === 4 && lightnessDiff === 2) { // in(number)
      let match = /[+-]?[0-9]+/.exec(this.input.slice(this.inputIndex));
      if (match && match.index === 0) {
        this.inputIndex += match[0].length;
        const num = parseInt(match[0]);
        this.stack.push(num);
      }
    } else if (hueDiff === 5 && lightnessDiff === 0) { // in(char)
      const codePoint = this.input.codePointAt(this.inputIndex);
      if (codePoint) {
        this.inputIndex++;
        this.stack.push(codePoint);
      }
    } else if (hueDiff === 5 && lightnessDiff === 1) { // out(number)
      const top = this.stack.pop();
      if (top !== undefined) {
        this.output += top.toString();
      }
    } else if (hueDiff === 5 && lightnessDiff === 2) { // out(char)
      const top = this.stack.pop();
      if (top !== undefined) {
        this.output += String.fromCodePoint(top);
      }
    }
  }

  public run(input?: string): { stack: number[], output: string } {
    this.input = input ?? '';
    let steps = 0;
    // HACK: 最初の位置がDP, CC方向の場所でないため、移動する
    // move()の改良で、最初の位置も考慮に入れて一般化できそう
    const newPos = getCodel(this.image, this.x, this.y, this.dp, this.cc);
    this.x = newPos.x;
    this.y = newPos.y;
    try {
      while (this.x >= 0 && this.y >= 0 && this.x < this.image.width && this.y < this.image.height) {
        const currentColor = this.image.getColor(this.x, this.y);
        this.previousCodelSize = getColorBlockValue(this.image, this.x, this.y);
        this.move();
        const nextColor = this.image.getColor(this.x, this.y);
        if (currentColor !== undefined && nextColor !== undefined) {
          this.executeCommand(currentColor, nextColor);
        }
        steps++;
        if (steps > 1000000) {
          console.log('steps > 1000000');
          return { stack: this.stack, output: this.output };
        }
      }
    } catch(e) {
    } finally {
      return { stack: this.stack, output: this.output };
    }
  }
}

// DEBUG 画像をテキストとしてプリントする
const ppProgram = (program: PietImage) => {
  for (let i = 0; i < program.height; i++) {
    let s = '';
    for (let j = 0; j < program.width; j++) {
      const h = program.getColor(j, i)?.hue;
      if (h === 'red') {
        s += 'r';
      } else if (h === 'magenta') {
        s += 'm';
      } else if (h === 'black') {
        s += 'b';
      } else if (h === 'yellow') {
        s += 'y';
      } else {
        s += ' ';
      }
    }
    console.log(s);
  }
};