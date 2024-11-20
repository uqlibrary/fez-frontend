// TODO move to config/doi.ts upon converting it to TS
export type DoiField<Keys> = {
    field: Keys;
    order: number;
    requiresUQ?: boolean;
    isRequired?: boolean;
};

export type DoiFields<Keys> = Record<string | number, { fields: DoiField<Keys>[]; subtypes?: string[] }>;
