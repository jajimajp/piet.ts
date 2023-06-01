import { PietImage } from '.';
import { Color, Hue } from './color';

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
  let lightness: undefined | 'normal' | 'light' | 'dark' = undefined;
  let hue: undefined | Hue = undefined;
  let color: undefined | Color = undefined;
  let lineColors: Array<Color> = [];

  for (let idx = 0; idx < line.length; idx++) {
    switch (line[idx]) {
      case 'l':
        if (lightness) {
          throw Error('invalid input: back to back lightness specification');
        }
        lightness = 'light';
        break;
      case 'n':
        if (lightness) {
          throw Error('invalid input: back to back lightness specification');
        }
        lightness = 'normal';
        break;
      case 'd':
        if (lightness) {
          throw Error('invalid input: back to back lightness specification');
        }
        lightness = 'dark';
        break;
      // Specify hue
      // NOTE: without break
      case 'r':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'red';
        if (!lightness) { lightness = 'normal'; }
        color = { hue, lightness };
        break;
      case 'y':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'yellow';
        if (!lightness) { lightness = 'normal'; }
        color = { hue, lightness };
        break;
      case 'g':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'green';
        if (!lightness) { lightness = 'normal'; }
        color = { hue, lightness };
        break;
      case 'c':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'cyan';
        if (!lightness) { lightness = 'normal'; }
        color = { hue, lightness };
        break;
      case 'b':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'blue';
        if (!lightness) { lightness = 'normal'; }
        color = { hue, lightness };
        break;
      case 'm':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'magenta';
        if (!lightness) { lightness = 'normal'; }
        color = { hue, lightness };
        break;
      case 'k':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'black';
        if (lightness) {
          throw Error('invalid input: specify lightness of black is not allowed');
        }
        color = { hue };
        break;
      case 'w':
        if (hue) { throw Error('invalid input: back to back hue specification'); }
        hue = 'white';
        if (lightness) {
          throw Error('invalid input: specify lightness of white is not allowed');
        }
        color = { hue };
        break;
      default:
        throw Error('invalid input: ' + line[idx]);
    }
    if (color) {
      lineColors.push(color);
      lightness = undefined;
      hue = undefined;
      color = undefined;
    }
  }
  return lineColors;
}