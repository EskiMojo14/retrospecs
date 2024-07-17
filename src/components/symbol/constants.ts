export interface SymbolSettings {
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** -25 (low emphasis) to 200 (high emphasis), defaults to 0 */
  grade?: number;
  /** 20px to 48px, defaults to `size` */
  opticalSize?: number;
}

export const defaultSettings: Required<SymbolSettings> = {
  fill: false,
  weight: 400,
  grade: 0,
  opticalSize: 24,
};
