export type Result<T = unknown> = T | Error;

export const Result = <T>(value: T | Error): Result<T> => value;

Result.isErr = (result: Result): result is Error => result instanceof Error;

Result.isOk = <T>(result: Result<T>): result is T => !Result.isErr(result);
Result.unwrap = <T>(res: Result<T>): T => {
  if (Result.isErr(res)) {
    throw res;
  }
  return res;
};
