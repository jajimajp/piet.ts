import { print1 } from './testcase';
import { getCodel } from './getCodel';

const hues = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'black', 'white'] as const;
export type Hue = typeof hues[number];
const brightnesses = ['light', 'normal', 'dark'] as const;
export type Blightness = typeof brightnesses[number];
export type Direction = 'right' | 'down' | 'left' | 'up';
export type LR = 'left' | 'right';

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

  constructor(private image: PietImage) {
    this.x = 0;
    this.y = 0;
    this.dp = 'right';
    this.cc = 'left';
    this.stack = [];
  }

  private static colorDifference(from: Color, to: Color): [number, number] {
    if (from.hue === 'black' || from.hue === 'white' || to.hue === 'black' || to.hue === 'white') {
      throw Error('TODO: black and white is currently not supported.');
    }
    const hueDiff = hues.indexOf(to.hue) - hues.indexOf(from.hue);
    const brightnessDiff = brightnesses.indexOf(to.brightness) - brightnesses.indexOf(from.brightness);
    return [
      (hueDiff + hues.length) % hues.length,
      (brightnessDiff + brightnesses.length) % brightnesses.length,
    ];
  }

  private move(): void {
    if (this.dp === 'right') {
      this.x++;
    } else if (this.dp === 'down') {
      this.y++;
    } else if (this.dp === 'left') {
      this.x--;
    } else if (this.dp === 'up') {
      this.y--;
    }
  }

  private executeCommand(from: Color, to: Color): void {
    const [hueDiff, lightnessDiff] = PietInterpreter.colorDifference(from, to);

    if (hueDiff === 1 && lightnessDiff === 0) { // add
      if (this.stack.length >= 2) {
        const op1 = this.stack[this.stack.length - 1];
        const op2 = this.stack[this.stack.length - 2];
        this.stack.splice(this.stack.length, 1, op1 + op2);
      }
    }
    // TODO 他のコマンドも実装する
  }

  public run(): void {
    while (this.x >= 0 && this.y >= 0 && this.x < this.image.width && this.y < this.image.height) {
      const currentColor = this.image.getColor(this.x, this.y);
      this.move();
      const nextColor = this.image.getColor(this.x, this.y);
      if (currentColor !== undefined && nextColor !== undefined) {
        this.executeCommand(currentColor, nextColor);
      }
    }
  }
}

// DEBUG 画像をテキストとしてプリントする
const ppProgram = (program: PietImage) => {
  for (let i = 0; i < program.height; i++) {
    let s = '';
    for (let j = 0; j < program.height; j++) {
      const h = program.getColor(j, i)?.hue;
      if (h === 'red') {
        s += 'r';
      } else if (h === 'magenta') {
        s += 'm';
      } else if (h === 'black') {
        s += 'b';
      } else {
        s += ' ';
      }
    }
    console.log(s);
  }
};
ppProgram(print1);

console.log(getCodel(print1, 1, 0, 'right', 'left'));