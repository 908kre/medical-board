export type Log =
  | string
  | ({
      message?: unknown;
    } & Record<string, unknown>)
  | Error;

export type Logger = {
  debug: (x: Log) => void;
  info: (x: Log) => void;
  warn: (x: Log) => void;
  error: (x: Log) => void;
};
