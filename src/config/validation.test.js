import React from 'react';
import * as validation from './validation';
import {accounts} from 'mock/data/account';
import {locale} from '.';

describe('Validation method', () => {
    it('should validate required', () => {
        const testFailValue = validation.required(null);
        expect(testFailValue).toEqual(locale.validationErrors.required);

        const testValue = validation.required('abc');
        expect(testValue).toEqual(undefined);
    });

    it('should validate email', () => {
        const testFailValue = validation.email('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.email);

        const testValue = validation.required('abc@abc.com');
        expect(testValue).toEqual(undefined);
    });

    it('should validate url', () => {
        const testFailValue = validation.url('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.url);

        const testValue = validation.required('http://hello.com');
        expect(testValue).toEqual(undefined);
    });

    it('should validate Issn', () => {
        const testFailValue = validation.isValidIssn('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.issn);

        let testValue = validation.isValidIssn('1234-1243');
        expect(testValue).toEqual('');

        testValue = validation.isValidIssn('ISSN 1234-1243');
        expect(testValue).toEqual('');
    });

    it('should validate Isbn', () => {
        const testFailValue = validation.isValidIsbn('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.isbn);

        let testValue = validation.isValidIsbn('ISBN 0-14-020652-3');
        expect(testValue).toEqual('');

        testValue = validation.isValidIsbn('0-14-020652-3');
        expect(testValue).toEqual('');
    });

    it('should validate max length', () => {
        expect(validation.maxLength10('sdjflsjdlfjslsdjflsjdlfjslsdjflsjdlfjslsdjflsjdlfjsl'))
            .toEqual(locale.validationErrors.maxLength.replace('[max]', 10));

        expect(validation.maxLength10('123')).toEqual(undefined);
    });


    it('it should validate doi correctly', () => {
        expect(validation.isValidDOIValue(' 10.1007/978-3-319-60492-3_52 ')).toBeTruthy();
        expect(validation.isValidDOIValue(' 10.1007/something ')).toBeTruthy();
    });

    it('it should validate pubmed id correctly', () => {
        expect(validation.isValidPubMedValue(' 2342523452 ')).toBeTruthy();
    });

    it('it should validate publication title correctly', () => {
        expect(validation.isValidPublicationTitle(' global    ')).toBeFalsy();
        expect(validation.isValidPublicationTitle(' global war ')).toBeTruthy();
    });
    
});

