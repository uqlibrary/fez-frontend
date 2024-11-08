// this is similar to using Partial<...>, but it provides better type hinting
type Optional<T> = {
    [K in keyof T]: T[K]
}

export type Values = string | number | boolean | undefined | null

export interface CoreAttributes {
    [key: `rek_${string}`]: Values
}

// Relations
// use conditional typing to define that 'author' nested relation should only have values with types defined by Values
export type NestedRelation = {
    [key in 'parent' | 'author']?: key extends 'parent' ? Record<string, Values | NestedRelation> : Record<string, Values>
}
export type OneToOneRelation = CoreAttributes
export type OneToManyRelation = CoreAttributes & NestedRelation
export interface Relations {
    [key: `fez_record_search_key_${string}`]: OneToOneRelation | OneToManyRelation[] | null
}

export type Attributes = keyof CoreAttributes & keyof Relations
export type FezRecord = Optional<CoreAttributes & Relations>
