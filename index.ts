import { add_1_2, print1 } from './testcase';
import { getCodel } from './getCodel';
import { getColorBlockValue } from './getColorBlockValue';

const hues = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'black', 'white'] as const;
export type Hue = typeof hues[number];
const brightnesses = ['light', 'normal', 'dark'] as const;
export type Blightness = typeof brightnesses[number];
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

export interface Position {
  x: number;
  y: number;
}

export type Color = {
  hue: Exclude<Hue, 'black' | 'white'>;
  brightness: Blightness;
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

class PietInterpreter {
  private x: number;
  private y: number;
  private dp: Direction;
  private cc: LR;
  private stack: number[];
  private previousCodelSize: number;
  private output: string;

  constructor(private image: PietImage) {
    this.x = 0;
    this.y = 0;
    this.dp = 'right';
    this.cc = 'left';
    this.stack = [];
    this.previousCodelSize = 0;
    this.output = '';
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

    if (hueDiff === 1 && lightnessDiff === 0) { // add
      if (this.stack.length >= 2) {
        const op1 = this.stack[this.stack.length - 1];
        const op2 = this.stack[this.stack.length - 2];
        this.stack.splice(this.stack.length, 1, op1 + op2);
      }
    } else if (hueDiff === 0 && lightnessDiff === 1) { // push
      this.stack.push(this.previousCodelSize);
    } else if (hueDiff === 5 && lightnessDiff === 1) { // out(number)
      const top = this.stack.pop();
      if (top !== undefined) {
        this.output += top.toString();
      }
    }
    // TODO 他のコマンドも実装する
  }

  public run(): void {
    let steps = 0;
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
        if (steps > 100) {
          console.log('steps > 100');
          return;
        }
      }
    } catch(e) {
    } finally {
      console.log(this.output);
      console.log({ stack: this.stack });
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

// ppProgram(add_1_2);

// test utils
// console.log(getCodel(print1, 1, 0, 'right', 'left')); // should be (2, 2)
// console.log(getColorBlockValue(print1, 1, 1)) // should be 4

const it = new PietInterpreter(add_1_2);
it.run();