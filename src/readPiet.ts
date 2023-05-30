import { PietImage, Color, Hue } from ".";

// .pietファイルを読み込む
// content: .pietファイルの中身
// 改行はLFであり、CR, スペースは無視される
// const readPiet = (content: string): PietImage => {
  
// }

export const getSize = (content: string): { width: number, height: number } => {
  const returns = content.match(/\n/g);
  const height = returns !== null ? returns.length : 0;
  const firstLine = (content.split(/\n/)[0]).replace(/\s+/g, '');
  
  let brightness: undefined | 'normal' | 'light' | 'dark' = undefined;
  let hue: undefined | Hue = undefined;
  let color: undefined | Color = undefined;
  let line: Array<Color> = [];

  for (let idx = 0; idx < firstLine.length; idx++) {
    switch (firstLine[idx]) {
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
        throw Error('invalid input: ' + firstLine[idx]);
    }
    if (color) {
      line.push(color);
      brightness = undefined;
      hue = undefined;
      color = undefined;
    }
  }
  const width = line.length;
  return { width, height };
}