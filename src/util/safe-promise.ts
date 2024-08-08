type SafePromise<T> = Promise<T> & {
  __linterBrands?: string;
};

export const asSafePromise = <T, U>(
  promise: Promise<T>,
  catchFn: (error: unknown) => U | PromiseLike<U>,
) => {
  return promise.catch(catchFn) as SafePromise<T | U>;
};
