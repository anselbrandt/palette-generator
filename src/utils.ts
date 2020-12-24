import namer from "color-namer";

const RGB_MAX: any = 255;
const HUE_MAX = 360;
const SV_MAX = 100;

export const hexToRgb = (hex: any) => {
  const match = hex.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return [0, 0, 0];
  }

  let colorString = match[0];

  if (match[0].length === 3) {
    colorString = colorString
      .split("")
      .map((char: string) => {
        return char + char;
      })
      .join("");
  }

  const integer = parseInt(colorString, 16);
  const r = (integer >> 16) & 0xff;
  const g = (integer >> 8) & 0xff;
  const b = integer & 0xff;

  return [r, g, b];
};

export const rgbToHex = (rgb: Array<number>) => {
  const [r, g, b] = rgb;
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const rgbToHsl = (rgb: number[]) => {
  let [r, g, b] = rgb;
  // It converts [0,255] format, to [0,1]
  r = r === RGB_MAX ? 1 : (r % RGB_MAX) / parseFloat(RGB_MAX);
  g = g === RGB_MAX ? 1 : (g % RGB_MAX) / parseFloat(RGB_MAX);
  b = b === RGB_MAX ? 1 : (b % RGB_MAX) / parseFloat(RGB_MAX);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [
    Math.round(h * HUE_MAX),
    Math.round(s * SV_MAX),
    Math.round(l * SV_MAX),
  ];
};

export const rgbToHsv = (rgb: number[]) => {
  let [r, g, b] = rgb;

  // It converts [0,255] format, to [0,1]
  r = r === RGB_MAX ? 1 : (r % RGB_MAX) / parseFloat(RGB_MAX);
  g = g === RGB_MAX ? 1 : (g % RGB_MAX) / parseFloat(RGB_MAX);
  b = b === RGB_MAX ? 1 : (b % RGB_MAX) / parseFloat(RGB_MAX);

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h: any,
    s,
    v = max;

  var d = max - min;

  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * HUE_MAX),
    s: Math.round(s * SV_MAX),
    v: Math.round(v * SV_MAX),
  };
};

export const hexToHsl = (hex: any) => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  return hsl;
};

export const hexToLightness = (hex: any) => {
  const rgb = hexToRgb(hex);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const lightness = ((min + max) / 2) * 100;
  return lightness;
};

const lighten = (hex: string, intensity: number) => {
  const color = hexToRgb(hex);
  const r = Math.round(color[0] + (255 - color[0]) * intensity);
  const g = Math.round(color[1] + (255 - color[1]) * intensity);
  const b = Math.round(color[2] + (255 - color[2]) * intensity);
  return rgbToHex([r, g, b]);
};

const darken = (hex: string, intensity: number) => {
  const color = hexToRgb(hex);
  const r = Math.round(color[0] * intensity);
  const g = Math.round(color[1] * intensity);
  const b = Math.round(color[2] * intensity);

  return rgbToHex([r, g, b]);
};

interface Palette {
  [shade: number]: string;
}

interface Color {
  [color: string]: Palette;
}

export const getPalette = (hex: string) => {
  const name = namer(hex).pantone[0].name.toLowerCase().replace(/\s/g, "-");
  const color: Color = {
    [name]: {
      500: `#${hex}`,
    },
  };
  const intensityMap: {
    [key: number]: number;
  } = {
    50: 0.95,
    100: 0.9,
    200: 0.75,
    300: 0.6,
    400: 0.3,
    600: 0.9,
    700: 0.75,
    800: 0.6,
    900: 0.49,
  };

  [50, 100, 200, 300, 400].forEach((level) => {
    color[name][level] = lighten(hex, intensityMap[level]);
  });

  [600, 700, 800, 900].forEach((level) => {
    color[name][level] = darken(hex, intensityMap[level]);
  });

  return color;
};
