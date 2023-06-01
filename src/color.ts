export const hues = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'black', 'white'] as const;
export const huesWithoutWhiteAndBlack =
  hues.filter(hue => hue !== 'black' && hue != 'white');

export type Hue = typeof hues[number];

export const lightnesses = ['light', 'normal', 'dark'] as const;

export type Lightness = typeof lightnesses[number];

export type Color = {
  hue: Exclude<Hue, 'black' | 'white'>;
  lightness: Lightness;
} | {
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
    return a.lightness === b.lightness
  }
}

const hueIndex = (hue: Exclude<Hue, 'white' | 'black'>): number => {
  switch (hue) {
    case 'red': return 0;
    case 'yellow': return 1;
    case 'green': return 2;
    case 'cyan': return 3;
    case 'blue': return 4;
    case 'magenta': return 5;
  }
}

// return: 0..(huesWithoutWhiteAndBlack.length)
const hueDiff = (
  from: Exclude<Hue, 'white' | 'black'>,
  to: Exclude<Hue, 'white' | 'black'>
) : number => {
  const mod = huesWithoutWhiteAndBlack.length;
  return (hueIndex(to) - hueIndex(from) + mod) % mod;
}

// return 0..2
const lightnessDiff = (from: Lightness, to: Lightness): number => {
  const mod = lightnesses.length;
  return (lightnesses.indexOf(to) - lightnesses.indexOf(from) + mod) % mod;
}

// do not accept white or black
// you should check colors before calling me
export const colorDiff = (
  from: Exclude<Color, { hue: 'white' | 'black' }>,
  to: Exclude<Color, { hue: 'white' | 'black' }>
): { hueDiff: number, lightnessDiff: number } => {
  return {
    hueDiff: hueDiff(from.hue, to.hue),
    lightnessDiff: lightnessDiff(from.lightness, to.lightness)
  }
}