export type Compute<T> = { [K in keyof T]: T[K] } & unknown;

export type Overwrite<T, U> = Compute<Omit<T, keyof U> & U>;

export type PickRequired<T, K extends keyof T> = Compute<
  Omit<T, K> & Required<Pick<T, K>>
>;
