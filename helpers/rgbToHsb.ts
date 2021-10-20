export default function (red: number, green: number, blue: number) {
  red /= 255;
  green /= 255;
  blue /= 255;
  const v = Math.max(red, green, blue),
    n = v - Math.min(red, green, blue);
  const h = n === 0 ? 0 : n && v === red ? (green - blue) / n : v === green ? 2 + (blue - red) / n : 4 + (red - green) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};