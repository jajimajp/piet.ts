import { PietImage } from ".";

// .pietファイルを読み込む
// content: .pietファイルの中身
// 改行はLFであり、CR, スペースは無視される
// const readPiet = (content: string): PietImage => {
  
// }

export const getSize = (content: string): { width: number, height: number } => {
  const returns = content.match(/\n/g);
  const height = returns !== null ? returns.length : 0;
  const firstLine = (content.split(/\n/)[0]).replace(/\s+/g, '');
  
  let brightness: undefined | 'light' | 'dark' = undefined;

  for (let idx = 0; idx < firstLine.length; idx++) {
    switch (firstLine[idx]) {
      case 'l':
        if (brightness) {
          throw Error('invalid input: back to back brightness specification');
        }
        brightness = 'light';
        break;
      case 'd':
        if (brightness) {
          throw Error('invalid input: back to back brightness specification');
        }
        brightness = 'dark';
        break;
      case 'r':
    }
  }

  console.log({ height, firstLine });
  return { width: 0, height: 0 };
}