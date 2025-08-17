export type Lock = {
  auto: <O>(keys: string[], fn: () => Promise<O>) => Promise<O | Error>;
};
