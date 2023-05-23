type Color = 'red' | 'yellow' | 'green' | 'cyan' | 'blue' | 'magenta';
type Blightness = 'light' | 'normal' | 'dark';
type Direction = 'right' | 'down' | 'left' | 'up';
type LR = 'left' | 'right';

interface PietImage {
  width: number;
  height: number;
  getColor: (x: number, y: number) => Color | null;
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
    const hues = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
    const fromIndex = hues.indexOf(from);
    const toIndex = hues.indexOf(to);
    return [
      (toIndex - fromIndex + hues.length) % hues.length,
      0 // TODO 明度の違いに対応する
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
      if (currentColor !== null && nextColor !== null) {
        this.executeCommand(currentColor, nextColor);
      }
    }
  }
}
