import rgbToHex from './rgbToHex';
import stringToRGBColorArray from './stringToRGBColorArray';

function stringToRGBColorHex(input: string): string {
  return rgbToHex(stringToRGBColorArray(input));
}

export default stringToRGBColorHex;
