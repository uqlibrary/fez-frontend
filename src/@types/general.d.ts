// this is similar to using Partial<...>, but it provides better type hinting
type Optional<T> = {
    [K in keyof T]: T[K];
};

export type PrimitiveValues = string | number | boolean | undefined | null | bigint | symbol;
