
declare class Chord {
  static parse: (chord: string) => Chord | null
  toString: () => string
  clone: () => Chord
  normalize: () => Chord
  switchModifier: () => Chord
  useModifier: (modifier: '#' | 'b') => Chord
  transpose: (delta: number) => Chord
  transposeUp: () => Chord
  transposeDown: () => Chord
}
declare module 'chordjs' {

  export = Chord
}