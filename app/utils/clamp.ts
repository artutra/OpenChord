const clamp = (num: number, min: number, max: number): number => {
  return num <= min ? min : num >= max ? max : num;
}
export default clamp