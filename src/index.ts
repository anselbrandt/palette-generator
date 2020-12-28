import { getCustomPalette } from "./paletteUtils";
import { toJson } from "./jsUtils";
import { hexToHsl } from "./colorUtils";

const tomato = "#ff6347";
// const intensityMap = [0.95, 0.9, 0.75, 0.6, 0.3, 0.9, 0.75, 0.6, 0.49];

const palette = getCustomPalette(tomato);
const notHex = {
  ...palette,
  values: palette.values.map((value) => hexToHsl(value)),
};
console.log(notHex);
