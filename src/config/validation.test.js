import React from 'react';
import * as validation from './validation';
import {accounts} from 'mock/data/account';
import {locale} from 'locale';
import {APP_URL} from 'config';
import Immutable from 'immutable';

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

        const testValue6 = validation.url(APP_URL + 'view/UQ:36649');
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
        expect(validation.maxLength10('sdjflsjdlfjslsdjflsjdlfjslsdjflsjdlfjslsdjflsjdlfjsl')).toEqual(locale.validationErrors.maxLength.replace('[max]', 10));
        expect(validation.maxLength10('123')).toEqual(undefined);
        expect(validation.maxLength10('abc def gji')).toEqual(undefined);
        expect(validation.maxLength10(1234)).toEqual(undefined);
        expect(validation.maxLength10(12345678901)).toEqual(locale.validationErrors.maxLength.replace('[max]', 10));
    });

    it('should validate doi', () => {
        expect(validation.isValidDOIValue(' 10.1007/978-3-319-60492-3_52 ')).toBeTruthy();
        expect(validation.isValidDOIValue(' 10.1007/something ')).toBeTruthy();
    });

    it('should validate pubmed id', () => {
        expect(validation.isValidPubMedValue(' 2342523452 ')).toBeTruthy();
    });

    it('should validate publication title', () => {
        expect(validation.isValidPublicationTitle(' global    ')).toBeFalsy();
        expect(validation.isValidPublicationTitle(' global war ')).toBeTruthy();
    });

    it('should validate person selected', () => {
        expect(validation.peopleRequired([], 'Error', true)).toEqual('Error');
        expect(validation.peopleRequired([{name: 'First person'}], 'Error', true)).toEqual('Error');
        expect(validation.peopleRequired([{name: 'First person', selected: true}], 'Error', true)).toBeFalsy();
        expect(validation.peopleRequired([], 'Error', false)).toEqual('Error');
        expect(validation.peopleRequired([{name: 'First person'}], 'Error', false)).toBeFalsy();
    });

    it('should validate author/contributor link', () => {
        const contributorLinkValid = {"authors":[{"rek_contributor_id_id":null,"rek_contributor_id_pid":"UQ:641272","rek_contributor_id":410,"rek_contributor_id_order":1}],"valid":true};
        const authorLinkValid = {"authors":[{"rek_contributor_id_id":null,"rek_contributor_id_pid":"UQ:641272","rek_contributor_id":410,"rek_contributor_id_order":1}],"valid":true};

        expect(validation.isValidAuthorLink(authorLinkValid)).toEqual('');
        expect(validation.isValidAuthorLink('Invalid data')).toEqual(locale.validationErrors.authorLinking);
        expect(validation.isValidContributorLink(contributorLinkValid)).toEqual('');
        expect(validation.isValidContributorLink('Invalid data')).toEqual('');
        expect(validation.isValidContributorLink('Invalid data', true)).toEqual(locale.validationErrors.contributorLinking);
    });

    it('should validate google scholar id', () => {
        expect(validation.isValidGoogleScholarId('231234252345')).toEqual('');
        expect(validation.isValidGoogleScholarId('rtgtwDFRjuHn')).toEqual('');
        expect(validation.isValidGoogleScholarId('-31234252345')).toEqual('');
        expect(validation.isValidGoogleScholarId('12345vbgHJ0p')).toEqual('');
        expect(validation.isValidGoogleScholarId('rtgtwDFRjuH')).toEqual(locale.validationErrors.googleScholarId);
    });

    it('should validate if the grants form is currently poplated', () => {
        expect(validation.grantFormIsPopulated(true)).toEqual(locale.validationErrors.grants);
        expect(validation.grantFormIsPopulated({grantAgencyName: '', grantId: '', grantAgencyType: ''})).toEqual(undefined);
    });

    it('should conditionally validate file uploader based on open access value', () => {
        expect(validation.fileUploadNotRequiredForMediated(undefined, Immutable.Map({}))).toEqual(locale.validationErrors.fileUploadRequired);
        expect(validation.fileUploadNotRequiredForMediated(undefined, Immutable.Map({
            fez_record_search_key_access_conditions: {rek_access_conditions: 'Mediated Access'}
        }))).toEqual(undefined);
    });
});

describe('getErrorAlertProps ', () => {
    it('should return props for alert', () => {
        // dirty = false, submitting = false, error, formErrors, submitSucceeded = false, alertLocale = {}
        const testCases = [
            {
                parameters: {dirty: true, error: 'oops', alertLocale: {errorAlert: {title: 'submitFailed' }}},
                expected: 'submitFailed'
            },
            {
                parameters: {dirty: true, formErrors: [{'rek_title': 'This field is required'}], alertLocale: {validationAlert: {title: 'validationFailed'}}},
                expected: 'validationFailed'
            },
            {
                parameters: {submitFailed: true, dirty: true, formErrors: [{'rek_title': 'This field is required'}], alertLocale: {validationAlert: {title: 'validationFailed'}}},
                expected: 'validationFailed'
            },
            {
                parameters: {submitting: true, alertLocale: {progressAlert: {title: 'submitting' }}},
                expected: 'submitting'
            },
            {
                parameters: {submitSucceeded: true, alertLocale: {successAlert: {title: 'submitSucceeded' }}},
                expected: 'submitSucceeded'
            }
        ];

        testCases.forEach(testCase => {
            const alertProps = validation.getErrorAlertProps({...testCase.parameters});
            expect(alertProps.title).toEqual(testCase.expected);
        });
    });

    it('should return correct validation error summary', () => {
        const testCases = [
            {
                parameters: {'rek_title': 'This field is required'},
                expected: 'Title is required'
            },
            {
                parameters: {'fez_record_search_key_journal_name': {'rek_journal_name': 'This field is required'}},
                expected: 'Journal name is required'
            }
        ];

        testCases.forEach(testCase => {
            const errorMsgs = validation.translateFormErrorsToText(testCase.parameters);
            expect(errorMsgs[0]).toEqual(testCase.expected);
        });

        const nonExistingFieldTestCase = {
            parameters: {'some_nonexisting_field': 'This field is required'},
            expected: null
        };

        const testMessage = validation.translateFormErrorsToText(nonExistingFieldTestCase.parameters);
        expect(testMessage).toBeNull();

        const emptyMessage = validation.translateFormErrorsToText('');
        expect(emptyMessage).toBeNull();
    });
});


describe('checkDigit ', () => {
    it('should check checksum digit of ISMN values correctly', () => {
        const testCases = [
            '9790123456785',
            '979-0-1234-5678-5',
            '979-0-123-45678-5',
            'M-2306-7118-7',
        ];

        testCases.forEach(testCase => {
            expect(validation.checkDigit(testCase)).toBeTruthy();
        });
    });

    it('should check checksum digit of ISMN values incorrectly', () => {
        const testCases = [
            'ISMN 979-0-1234-5678-5',
            'THIS IS NOT A VALID ISMN',
            '12345',
            12345,
        ];

        testCases.forEach(testCase => {
            expect(validation.checkDigit(testCase)).toBeFalsy();
        });
    });
});

