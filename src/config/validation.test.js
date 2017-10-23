import React from 'react';
import * as rules from './validation';

describe('Validation rules ', () => {
    it('it should validate doi correctly', () => {
        expect(rules.isValidDOIValue(' 10.1007/978-3-319-60492-3_52 ')).toBeTruthy();
    });

    it('it should validate pubmed id correctly', () => {
        expect(rules.isValidPubMedValue(' 2342523452 ')).toBeTruthy();
    });

    it('it should validate publication title correctly', () => {
        expect(rules.isValidPublicationTitle(' global    ')).toBeFalsy();
        expect(rules.isValidPublicationTitle(' global war ')).toBeTruthy();
    });
});
