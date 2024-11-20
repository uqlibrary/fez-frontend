// TODO remove upon converting doi.js to TS
export type DoiField<Keys> = {
    field: Keys;
    order: number;
    requiresUQ?: boolean;
    isRequired?: boolean;
};

export type DoiFields<Keys> = Record<string | number, { fields: DoiField<Keys>[]; subtypes?: string[] }>;
