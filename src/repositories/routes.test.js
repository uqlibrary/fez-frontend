import React from 'react';
import {prepareTextSearchQuery} from './routes';

describe('Backend routes unit tests', () => {
    it('it should escape elastic search reserved characters', () => {
        const searchQuery = " The next chars should be escaped: + - = && || > < ! ( ) { } [ ] ^ \" ~ * ? : \\ / Did it work?  ";
        const expected = "The+next+chars+should+be+escaped\\:+\\++\\-+\\=+\\&\\&+\\|\\|+++\\!+\\(+\\)+\\{+\\}+\\[+\\]+\\^+\\\"+\\~+\\*+\\?+\\:+\\\\+\\/+Did+it+work\\?";
        expect(prepareTextSearchQuery(searchQuery)).toBe(expected);
    });
});