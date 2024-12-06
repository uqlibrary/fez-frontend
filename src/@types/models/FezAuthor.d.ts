import { Optional, PrimitiveValues } from '../general';

/* The types below are a representation of eSpace FezAuthor model. */

export interface CoreAttributes {
    [key: `aut_${string}`]: PrimitiveValues
}

export interface FezAuthor extends Optional<CoreAttributes> {
    aut_id: number | string;
}
