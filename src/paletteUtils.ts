import namer from "color-namer";

import {
  hexToHsl,
  hslToHex,
  hexToHsv,
  hsvToHex,
  hexToRgb,
  rgbToHex,
} from "./colorUtils";

const changeLightness = (hex: string, intensity: number) => {
  let [h, s, l] = hexToHsl(hex);
  l = l * intensity;
  return hslToHex([h, s, l]);
};

const changeValue = (hex: string, intensity: number) => {
  let [h, s, v] = hexToHsv(hex);
  v = v * intensity;
  return hsvToHex([h, s, v]);
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

export const getPalette = (hex: string, arg?: string) => {
  const name = namer(hex).pantone[0].name.toLowerCase().replace(/\s/g, "-");
  const color: Color = {
    [name]: {
      500: `#${hex.replace(/#/g, "")}`,
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
  const lMap: {
    [key: number]: number;
  } = {
    50: 2.02,
    100: 1.98,
    200: 1.81,
    300: 1.65,
    400: 1.33,
    600: 0.9,
    700: 0.75,
    800: 0.6,
    900: 0.49,
  };
  const vMap: {
    [key: number]: number;
  } = {
    50: 1.35,
    100: 1.31,
    200: 1.27,
    300: 1.22,
    400: 1.11,
    600: 0.9,
    700: 0.75,
    800: 0.6,
    900: 0.49,
  };

  switch (arg) {
    case "l":
      [50, 100, 200, 300, 400, 600, 700, 800, 900].forEach((level) => {
        color[name][level] = changeLightness(hex, lMap[level]);
      });
      break;
    case "v":
      [50, 100, 200, 300, 400, 600, 700, 800, 900].forEach((level) => {
        color[name][level] = changeValue(hex, vMap[level]);
      });
      break;
    default:
      [50, 100, 200, 300, 400].forEach((level) => {
        color[name][level] = lighten(hex, intensityMap[level]);
      });
      [600, 700, 800, 900].forEach((level) => {
        color[name][level] = darken(hex, intensityMap[level]);
      });
  }

  return color;
};

interface Options {
  colorSpace?: string;
  intensityMap?: number[];
}

export const getCustomPalette = (hex: string, options?: Options) => {
  const name = namer(hex).pantone[0].name.toLowerCase().replace(/\s/g, "-");
  const color: Color = {
    [name]: {
      500: `#${hex.replace(/#/g, "")}`,
    },
  };

  let intensityMap: {
    [key: number]: number;
  };

  const defaultMap: {
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

  if (options?.intensityMap && options.intensityMap.length === 9) {
    const mapKeys = [50, 100, 200, 300, 400, 600, 700, 800, 900];
    const values = options.intensityMap;
    const entries = mapKeys.map((key, index) => [key, values[index]]);
    const customMap = Object.fromEntries(entries);
    intensityMap = customMap;
  } else {
    intensityMap = defaultMap;
  }

  switch (options?.colorSpace) {
    case "hsl":
      [50, 100, 200, 300, 400, 600, 700, 800, 900].forEach((level) => {
        color[name][level] = changeLightness(hex, intensityMap[level]);
      });
      break;
    case "hsv":
      [50, 100, 200, 300, 400, 600, 700, 800, 900].forEach((level) => {
        color[name][level] = changeValue(hex, intensityMap[level]);
      });
      break;
    default:
      [50, 100, 200, 300, 400].forEach((level) => {
        color[name][level] = lighten(hex, intensityMap[level]);
      });
      [600, 700, 800, 900].forEach((level) => {
        color[name][level] = darken(hex, intensityMap[level]);
      });
  }

  return color;
};
