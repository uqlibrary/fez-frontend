// characters/index.js

import arrows from './arrows';
import currency from './currency';
import latin from './latin';
import latin2 from './latin2';
import latin3 from './latin3';
import mathematics from './mathematics';
import text from './text';

const latinCharacters = [...latin, ...latin2, ...latin3];
export const characters = {
    arrows,
    currency,
    latin: latinCharacters,
    mathematics,
    text,
};

export const allCharacters = [
    ...characters.mathematics,
    ...characters.latin,
    ...characters.text,
    ...characters.currency,
    ...characters.arrows,
];

export const categories = [
    {
        id: 'all',
        label: 'All',
        characters: allCharacters,
    },
    {
        id: 'mathematics',
        label: 'Mathematics',
        characters: characters.mathematics,
    },
    {
        id: 'latin',
        label: 'Latin',
        characters: characters.latin,
    },
    {
        id: 'text',
        label: 'Text',
        characters: characters.text,
    },
    {
        id: 'currency',
        label: 'Currency',
        characters: characters.currency,
    },
    {
        id: 'arrows',
        label: 'Arrows',
        characters: characters.arrows,
    },
];
