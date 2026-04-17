import { Optional, PrimitiveValues } from '../general';
import { FezAuthor } from './FezAuthor';

/* The types below are a representation of eSpace FezRecordSearchKey model. */

export interface CoreAttributes {
    [key: `rek_${string}`]: PrimitiveValues;
}

// Relations
// use conditional typing to define that 'author' nested relation should only be typeof PrimitiveValues,
// otherwise typeof T - e.g FezRecord
type INestedRelation<T> = {
    [key in 'parent' | 'author']?: key extends 'parent' ? T : FezAuthor;
};
export type OneToOneRelation = CoreAttributes;
type IOneToManyRelation<T> = CoreAttributes & INestedRelation<T>;
interface IRelations<T> {
    [key: `fez_record_search_key_${string}`]: OneToOneRelation | IOneToManyRelation<T>[] | null;
}

type IAttributes<T> = keyof CoreAttributes & keyof IRelations<T>;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export interface FezRecord extends Optional<CoreAttributes & IRelations<FezRecord>> {}

export type Relations = IRelations<FezRecord>;
export type Attributes = IAttributes<FezRecord>;
export type OneToManyRelation = IOneToManyRelation<FezRecord>;
export type NestedRelation = INestedRelation<FezRecord>;
