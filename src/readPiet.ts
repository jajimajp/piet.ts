import { PietImage, Color, Hue } from ".";

// .pietファイルを読み込む
// content: .pietファイルの中身
// 改行はLFであり、CR, スペースは無視される
export const readPiet = (content: string): PietImage => {
  const { width, height } = getSize(content);
  const lines = content.split('\n');
  const colors: Array<Array<Color>> = [];
  for (let y = 0; y < height; y++) {
    const line = lines[y].replace(/\s+/g, ''); // remove whitespaces
    const lineColors = getLineColors(line);
    colors.push(lineColors);
  }
  return {
    width,
    height,
    getColor: (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return undefined;
      } else {
        return colors[y][x];
      }
    }
  }
}

const getSize = (content: string): { width: number, height: number } => {
  const returns = content.match(/\n/g);
  const height = returns !== null ? returns.length : 0;
  const firstLine = (content.split('\n')[0]).replace(/\s+/g, '');
  const width = getLineColors(firstLine).length;
  return { width, height };
}

const getLineColors = (line: string): Array<Color> => {
  let brightness: undefined | 'normal' | 'light' | 'dark' = undefined;
  let hue: undefined | Hue = undefined;
  let color: undefined | Color = undefined;
  let lineColors: Array<Color> = [];

  for (let idx = 0; idx < line.length; idx++) {
    switch (line[idx]) {
      case 'l':
        if (brightness) {
          throw Error('invalid input: back to back brightness specification');
        }
        brightness = 'light';
        break;
      case 'n':
        if (brightness) {
          throw Error('invalid input: back to back brightness specification');
        }
        brightness = 'normal';
        break;
      case 'd':
        if (brightness) {
          throw Error('invalid input: back to back brightness specification');
        }
        brightness = 'dark';
        break;
      // Specify hue
      // NOTE: without break
      case 'r':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'red';
        if (!brightness) { brightness = 'normal'; }
        color = { hue, brightness };
        break;
      case 'y':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'yellow';
        if (!brightness) { brightness = 'normal'; }
        color = { hue, brightness };
        break;
      case 'g':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'green';
        if (!brightness) { brightness = 'normal'; }
        color = { hue, brightness };
        break;
      case 'c':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'cyan';
        if (!brightness) { brightness = 'normal'; }
        color = { hue, brightness };
        break;
      case 'b':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'blue';
        if (!brightness) { brightness = 'normal'; }
        color = { hue, brightness };
        break;
      case 'm':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'magenta';
        if (!brightness) { brightness = 'normal'; }
        color = { hue, brightness };
        break;
      case 'k':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'black';
        if (brightness) {
          throw Error('invalid input: specify brightness of black is not allowed');
        }
        color = { hue };
        break;
      case 'w':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'white';
        if (brightness) {
          throw Error('invalid input: specify brightness of white is not allowed');
        }
        color = { hue };
        break;
      default:
        throw Error('invalid input: ' + line[idx]);
    }
    if (color) {
      lineColors.push(color);
      brightness = undefined;
      hue = undefined;
      color = undefined;
    }
  }
  return lineColors;
}