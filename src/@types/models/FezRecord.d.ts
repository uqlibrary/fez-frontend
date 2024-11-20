// this is similar to using Partial<...>, but it provides better type hinting
type Optional<T> = {
    [K in keyof T]: T[K]
}

export type Values = string | number | boolean | undefined | null

export interface CoreAttributes {
    [key: `rek_${string}`]: Values
}

// Relations
// use conditional typing to define that 'author' nested relation should only be typeof Values,
// otherwise typeof T - e.g FezRecord
type INestedRelation<T> = {
    [key in 'parent' | 'author']?: key extends 'parent' ? T : Record<string, Values> // TODO update last to FezAuthor once created
}
export type OneToOneRelation = CoreAttributes
type IOneToManyRelation<T> = CoreAttributes & INestedRelation<T>
interface IRelations<T> {
    [key: `fez_record_search_key_${string}`]: OneToOneRelation | IOneToManyRelation<T>[] | null
}

type IAttributes<T> = keyof CoreAttributes & keyof IRelations<T>
// @ts-expect-error
export interface FezRecord extends Optional<CoreAttributes & IRelations<FezRecord>> {}

export type Relations = IRelations<FezRecord>;
export type Attributes = IAttributes<FezRecord>;
export type OneToManyRelation = IOneToManyRelation<FezRecord>;
export type NestedRelation = INestedRelation<FezRecord>;
