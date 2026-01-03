import hslToRgb from './hslToRgb';

function fnv1a32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function xorshift32(seed: number) {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x = x >>> 0;
    x ^= x >>> 17;
    x = x >>> 0;
    x ^= x << 5;
    x = x >>> 0;
    return (x >>> 0) / 0x100000000; // [0,1)
  };
}

/**
 * Converts a string to a RGB color array [R, G, B] (deterministic).
 * @param input - The input string.
 * @returns An array containing the RGB color values.
 */
function stringToRGBColorArray(input: string): [number, number, number] {
  const seed = fnv1a32(input + '\x00'); // small tweak to reduce collisions
  const rand = xorshift32(seed);

  // sample 3 values from PRNG (amplifies small changes)
  const hue = Math.floor(rand() * 360);
  const sat = 50 + Math.floor(rand() * 30); // 50-80% saturation (vivid)
  const light = 35 + Math.floor(rand() * 25); // 35-60% lightness (readable)

  return hslToRgb(hue, sat, light);
}

export default stringToRGBColorArray;
