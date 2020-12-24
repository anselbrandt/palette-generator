import { getPalette, hexToRgb, rgbToHsl } from "./utils";

const jpalette = {
  jupiter: {
    50: "#f5fbfc",
    100: "#ebf7f8",
    200: "#ceecef",
    300: "#b0e0e5",
    400: "#75c9d1",
    500: "#3ab2bd",
    600: "#34a0aa",
    700: "#2c868e",
    800: "#236b71",
    900: "#1c575d",
  },
};

const jcolor = "#3ab2bd";

const hexToNew = (hex: string) => {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsl(rgb);
  return hsv;
};

const entries = Object.entries(jpalette.jupiter);
const newEntries = entries.map((entry) => [entry[0], hexToNew(entry[1])]);
const newColor = Object.fromEntries(newEntries);

console.log(newColor);
