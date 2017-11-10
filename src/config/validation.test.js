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
        const testValue = validation.url('http://test.com');
        expect(testValue).toEqual(undefined);

        const testValue2 = validation.url('https://apps.webofknowledge.com/full_record.do?product=WOS&search_mode=GeneralSearch&qid=4&SID=V2InJRD4KnBeEPoPCGm&page=1&doc=1');
        expect(testValue2).toEqual(undefined);

        const testValue3 = validation.url('https://www.uq.edu.au?test=This%20is%20a%20test');
        expect(testValue3).toEqual(undefined);

        const testValue4 = validation.url('ftp://192.168.0.1/test.pdf');
        expect(testValue4).toEqual(undefined);

        const testValue5 = validation.url('ftps://192.168.0.1:password@username/test.pdf');
        expect(testValue5).toEqual(undefined);

        const testValue6 = validation.url('https://fez-staging.library.uq.edu.au/view/UQ:36649');
        expect(testValue6).toEqual(undefined);

        const testValue7 = validation.url('http://1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
        expect(testValue7).toEqual(undefined);

        const testFailValue = validation.url('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.url);

        const testFailValue2 = validation.url('file:///test.jpg');
        expect(testFailValue2).toEqual(locale.validationErrors.url);

        const testFailValue3 = validation.url('www.test.com');
        expect(testFailValue3).toEqual(locale.validationErrors.url);

        const testFailValue4 = validation.url('mailto:test@test.com');
        expect(testFailValue4).toEqual(locale.validationErrors.url);

        const testFailValue5 = validation.url('javascript:window.alert(\'test\');');
        expect(testFailValue5).toEqual(locale.validationErrors.url);

        const testFailValue6 = validation.url('http://12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
        expect(testFailValue6).toEqual(locale.validationErrors.maxLength.replace('[max]', '2000'));

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

    it('it should validate person selected correctly', () => {
        expect(validation.isPersonSelected([])).toBeFalsy();
        expect(validation.isPersonSelected([{name: 'First person'}])).toBeFalsy();
        expect(validation.isPersonSelected([{name: 'First person', selected: true}])).toBeTruthy();

        expect(validation.authorRequired([])).toBe(locale.validationErrors.authorRequired);
        expect(validation.editorRequired([])).toBe(locale.validationErrors.editorRequired);

        expect(validation.authorRequired([{name: 'First person'}])).toBe(locale.validationErrors.authorRequired);
        expect(validation.editorRequired([{name: 'First person'}])).toBe(locale.validationErrors.editorRequired);

        expect(validation.authorRequired([{name: 'First person', selected: true}])).toBeUndefined();
        expect(validation.editorRequired([{name: 'First person', selected: true}])).toBeUndefined();
    });
});

