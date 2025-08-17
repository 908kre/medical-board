type Filed = { key: string; value?: unknown };

export type Compose<T extends Filed> = {
  [K in T as K["key"]]: K["value"];
} extends infer U
  ? {
      [P in keyof U as undefined extends U[P] ? never : P]: U[P];
    } & {
      [P in keyof U as undefined extends U[P] ? P : never]?: U[P];
    }
  : never;
