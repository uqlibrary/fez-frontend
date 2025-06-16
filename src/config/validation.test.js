import * as validation from './validation';
import { locale } from 'locale';
import { APP_URL, viewRecordsConfig } from 'config';
import Immutable from 'immutable';
import { MEDIATED_ACCESS_ID } from 'config/general';
import { dateRange, isFileValid } from './validation';
import { STATE_DELETED } from './viewRecord';

describe('Validation method', () => {
    it('isFileValid should validate filename', () => {
        let validator = isFileValid(viewRecordsConfig);
        expect(validator({ dsi_dsid: 'test.pdf' })).toBeTruthy();
        expect(validator({ dsi_dsid: 'test_compressed.pdf' })).toBeTruthy();
        expect(validator({ dsi_dsid: 'FezACML_test_compressed.xml' })).toBeFalsy();
        expect(validator({ dsi_dsid: 'stream_test_compressed.flv' })).toBeFalsy();
        expect(validator({ dsi_dsid: 'web_test_compressed.jpg' })).toBeFalsy();
        expect(validator({ dsi_dsid: 'preview_test_compressed.jpg' })).toBeFalsy();
        expect(validator({ dsi_dsid: 'presmd_test_compressed.xml' })).toBeFalsy();
        expect(validator({ dsi_dsid: 'test_compressed_t.jpg' })).toBeFalsy();

        expect(validator({ dsi_dsid: 'test.pdf', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'test_compressed.pdf', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'FezACML_test_compressed.xml', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'stream_test_compressed.flv', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'web_test_compressed.jpg', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'preview_test_compressed.jpg', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'presmd_test_compressed.xml', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'test_compressed_t.jpg', dsi_state: STATE_DELETED })).toBeFalsy();

        validator = isFileValid(viewRecordsConfig, true);
        expect(validator({ dsi_dsid: 'test.pdf', dsi_state: STATE_DELETED })).toBeTruthy();
        expect(validator({ dsi_dsid: 'test_compressed.pdf', dsi_state: STATE_DELETED })).toBeTruthy();
        expect(validator({ dsi_dsid: 'FezACML_test_compressed.xml', dsi_state: STATE_DELETED })).toBeTruthy();
        expect(validator({ dsi_dsid: 'stream_test_compressed.flv', dsi_state: STATE_DELETED })).toBeTruthy();
        expect(validator({ dsi_dsid: 'web_test_compressed.jpg', dsi_state: STATE_DELETED })).toBeTruthy();
        expect(validator({ dsi_dsid: 'preview_test_compressed.jpg', dsi_state: STATE_DELETED })).toBeTruthy();
        expect(validator({ dsi_dsid: 'presmd_test_compressed.xml', dsi_state: STATE_DELETED })).toBeTruthy();
        expect(validator({ dsi_dsid: 'test_compressed_t.jpg', dsi_state: STATE_DELETED })).toBeTruthy();

        validator = isFileValid(viewRecordsConfig, true, true);
        expect(validator({ dsi_dsid: 'test.pdf', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'test_compressed.pdf', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'FezACML_test_compressed.xml', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'stream_test_compressed.flv', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'web_test_compressed.jpg', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'preview_test_compressed.jpg', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'presmd_test_compressed.jpg', dsi_state: STATE_DELETED })).toBeFalsy();
        expect(validator({ dsi_dsid: 'test_compressed_t.jpg', dsi_state: STATE_DELETED })).toBeFalsy();
    });

    it('should validate required', () => {
        const testFailValue = validation.required(null);
        expect(testFailValue).toEqual(locale.validationErrors.required);

        const testValue = validation.required('abc');
        expect(testValue).toEqual(undefined);
    });

    it('should validate email', () => {
        const testFailValue = validation.email('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.email);

        const testEmptyValue = validation.email('');
        expect(testEmptyValue).toEqual(undefined);

        const testValue = validation.email('abc@abc.com');
        expect(testValue).toEqual(undefined);
    });

    it('should validate url', () => {
        const testValue = validation.url('http://test.com');
        expect(testValue).toEqual(undefined);

        const testValue2 = validation.url(
            'https://apps.webofknowledge.com/full_record.do?product=WOS&search_mode=GeneralSearch&qid=4&SID=V2InJRD4KnBeEPoPCGm&page=1&doc=1',
        );
        expect(testValue2).toEqual(undefined);

        const testValue3 = validation.url('https://www.uq.edu.au?test=This%20is%20a%20test');
        expect(testValue3).toEqual(undefined);

        const testValue4 = validation.url('ftp://192.168.0.1/test.pdf');
        expect(testValue4).toEqual(undefined);

        const testValue5 = validation.url('ftps://192.168.0.1:password@username/test.pdf');
        expect(testValue5).toEqual(undefined);

        const testValue6 = validation.url(APP_URL + 'view/UQ:36649');
        expect(testValue6).toEqual(undefined);

        const testValue7 = validation.url(
            'http://1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
        );
        expect(testValue7).toEqual(undefined);

        const testFailValue = validation.url('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.url);

        const testFailValue2 = validation.url('file:///test.jpg');
        expect(testFailValue2).toEqual(locale.validationErrors.url);

        const testFailValue3 = validation.url('www.test.com');
        expect(testFailValue3).toEqual(locale.validationErrors.url);

        const testFailValue4 = validation.url('mailto:test@test.com');
        expect(testFailValue4).toEqual(locale.validationErrors.url);

        // eslint-disable-next-line no-script-url
        const testFailValue5 = validation.url("javascript:window.alert('test');");
        expect(testFailValue5).toEqual(locale.validationErrors.url);

        const testFailValue6 = validation.url(
            'http://12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
        );
        expect(testFailValue6).toEqual(locale.validationErrors.maxLength.replace('[max]', '2000'));
    });

    it('should validate Issn', () => {
        const testFailValue = validation.isValidIssn('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.issn);

        let testValue = validation.isValidIssn('1234-1243');
        expect(testValue).toEqual('');

        testValue = validation.isValidIssn('1234-124X');
        expect(testValue).toEqual('');
    });

    it('should validate Isbn', () => {
        const testFailValue = validation.isValidIsbn('sdjflsjdlfjsl');
        expect(testFailValue).toEqual(locale.validationErrors.isbn);

        let testValue = validation.isValidIsbn('9781510849419');
        expect(testValue).toEqual('');

        testValue = validation.isValidIsbn('0-14-020652-3');
        expect(testValue).toEqual('');
    });

    it('should validate max length', () => {
        expect(
            validation.spacelessMaxLength10Validator('sdjflsjdlfjslsdjflsjdlfjslsdjflsjdlfjslsdjflsjdlfjsl'),
        ).toEqual(locale.validationErrors.maxLength.replace('[max]', 10));
        expect(validation.spacelessMaxLength10Validator('123')).toEqual(undefined);
        expect(validation.spacelessMaxLength10Validator('abc def gji')).toEqual(undefined);
        expect(validation.spacelessMaxLength10Validator(1234)).toEqual(undefined);
        expect(validation.spacelessMaxLength10Validator(12345678901)).toEqual(
            locale.validationErrors.maxLength.replace('[max]', 10),
        );
    });

    it('should validate doi', () => {
        expect(validation.isValidDOIValue(null)).toBeFalsy();
        expect(validation.isValidDOIValue('10.1007/978-3-319-60492-3_52')).toBeTruthy();
        expect(validation.isValidDOIValue('10.1007/something')).toBeTruthy();
        expect(validation.isValidDOIValue('10.1021/jp030583+')).toBeTruthy();
        expect(validation.isValidDOIValue('10.2984/1534-6188(2008)62[205:ACOIGT]2.0.CO;2')).toBeTruthy();
    });

    it('should get doi', () => {
        const doi = '10.1007/978-3-319-60492-3_52';
        expect(validation.getDoi(`https://doi.org/${doi}`)).toBeTruthy();
        expect(validation.getDoi(`https://dx.doi.org/${doi}`)).toBeTruthy();
        expect(validation.getDoi(`https://12345/${doi}`)).toBeTruthy();
        expect(validation.getDoi(`abcde/${doi}`)).toBeTruthy();
        expect(validation.getDoi(doi)).toBeTruthy();
        expect(validation.getDoi('abcde')).toBeNull();
    });

    it('should sanitize doi', () => {
        const doi = '10.1007/978-3-319-60492-3_52';
        expect(validation.sanitizeDoi(`https://doi.org/${doi}`)).toBe(doi);
        expect(validation.sanitizeDoi(`https://dx.doi.org/${doi}`)).toBe(doi);
        expect(validation.sanitizeDoi(`https://12345/${doi}`)).toBe(doi);
        expect(validation.sanitizeDoi(`abcde/${doi}`)).toBe(doi);
        expect(validation.sanitizeDoi(doi)).toBe(doi);
        expect(validation.sanitizeDoi('abcde')).toBe('abcde');
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
        expect(validation.peopleRequired([{ name: 'First person' }], 'Error', true)).toEqual('Error');
        expect(validation.peopleRequired([{ name: 'First person', selected: true }], 'Error', true)).toBeFalsy();
        expect(validation.peopleRequired([], 'Error', false)).toEqual('Error');
        expect(validation.peopleRequired([{ name: 'First person' }], 'Error', false)).toBeFalsy();
    });

    it('should validate author/contributor link', () => {
        const contributorLinkValid = {
            authors: [
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:641272',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 1,
                },
            ],
            valid: true,
        };
        const authorLinkValid = {
            authors: [
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:641272',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 1,
                },
            ],
            valid: true,
        };

        expect(validation.isValidAuthorLink(authorLinkValid)).toEqual('');
        expect(validation.isValidAuthorLink('Invalid data')).toEqual(locale.validationErrors.authorLinking);
        expect(validation.isValidContributorLink(contributorLinkValid)).toEqual('');
        expect(validation.isValidContributorLink('Invalid data')).toEqual('');
        expect(validation.isValidContributorLink('Invalid data', true)).toEqual(
            locale.validationErrors.contributorLinking,
        );
    });

    it('should validate google scholar id', () => {
        expect(validation.isValidGoogleScholarId('231234252345')).toBeUndefined();
        expect(validation.isValidGoogleScholarId('rtgtwDFRjuHn')).toBeUndefined();
        expect(validation.isValidGoogleScholarId('-31234252345')).toBeUndefined();
        expect(validation.isValidGoogleScholarId('12345vbgHJ0p')).toBeUndefined();
        expect(validation.isValidGoogleScholarId('rtgtwDFRjuH')).toEqual(locale.validationErrors.googleScholarId);
    });

    it('should validate if the grants form is currently poplated', () => {
        expect(validation.grantFormIsPopulated(true)).toEqual(locale.validationErrors.grants);
        expect(validation.grantFormIsPopulated({ grantAgencyName: '', grantId: '', grantAgencyType: '' })).toEqual(
            undefined,
        );
    });

    it('should conditionally validate file uploader based on open access value', () => {
        expect(validation.fileUploadNotRequiredForMediated(undefined, Immutable.Map({}))).toEqual(
            locale.validationErrors.fileUploadRequired,
        );
        expect(
            validation.fileUploadNotRequiredForMediated(
                undefined,
                Immutable.Map({
                    fez_record_search_key_access_conditions: { rek_access_conditions: MEDIATED_ACCESS_ID },
                }),
            ),
        ).toEqual(undefined);
    });
});

describe('isAuthorOrEditorSelected', () => {
    it('should return onlyOneOfAuthorOrEditor error message when both authors and editors exist', () => {
        const testMessage = validation.isAuthorOrEditorSelected(
            { authors: ['author 1', 'author 2'], editors: ['editor 1', 'editor 2'] },
            true,
            true,
        );
        expect(testMessage.onlyOneOfAuthorOrEditor).toEqual(locale.validationErrors.onlyOneOfAuthorOrEditor);
    });

    it('should return editors required error message even when authors exist', () => {
        const testMessage = validation.isAuthorOrEditorSelected(
            { authors: ['author 1', 'author 2'], editors: [] },
            true,
            true,
            true,
        );
        expect(testMessage.editors).toEqual(locale.validationErrors.editorRequiredAdmin);
    });
});

describe('getErrorAlertProps ', () => {
    it('should return props for alert', () => {
        // dirty = false, submitting = false, error, formErrors, submitSucceeded = false, alertLocale = {}
        const testCases = [
            {
                parameters: { dirty: true, error: 'oops', alertLocale: { errorAlert: { title: 'submitFailed' } } },
                expected: 'submitFailed',
            },
            {
                parameters: {
                    dirty: true,
                    formErrors: { rek_title: 'This field is required' },
                    alertLocale: { validationAlert: { title: 'validationFailed' } },
                },
                expected: 'validationFailed',
            },
            {
                parameters: {
                    submitFailed: true,
                    dirty: true,
                    formErrors: { rek_title: 'This field is required' },
                    alertLocale: { validationAlert: { title: 'validationFailed' } },
                },
                expected: 'validationFailed',
            },
            {
                parameters: { submitting: true, alertLocale: { progressAlert: { title: 'submitting' } } },
                expected: 'submitting',
            },
            {
                parameters: { submitSucceeded: true, alertLocale: { successAlert: { title: 'submitSucceeded' } } },
                expected: 'submitSucceeded',
            },
        ];

        testCases.forEach(testCase => {
            const alertProps = validation.getErrorAlertProps({ ...testCase.parameters });
            expect(alertProps.title).toEqual(testCase.expected);
        });
    });

    it('should return correct validation error summary', () => {
        const testCases = [
            {
                parameters: { rek_title: 'This field is required' },
                expected: 'Title is required',
            },
            {
                parameters: { fez_record_search_key_journal_name: { rek_journal_name: 'This field is required' } },
                expected: 'Journal name is required',
            },
        ];

        testCases.forEach(testCase => {
            const errorMsgs = validation.translateFormErrorsToText(testCase.parameters);
            expect(errorMsgs[0]).toEqual(testCase.expected);
        });

        const nonExistingFieldTestCase = {
            parameters: { some_nonexisting_field: 'This field is required' },
            expected: null,
        };

        const testMessage = validation.translateFormErrorsToText(nonExistingFieldTestCase.parameters);
        expect(testMessage).toBeNull();

        const emptyMessage = validation.translateFormErrorsToText('');
        expect(emptyMessage).toBeNull();
    });
});

describe('checkDigit ', () => {
    it('should check checksum digit of ISMN values correctly', () => {
        const testCases = ['9790123456785', '979-0-1234-5678-5', '979-0-123-45678-5', 'M-2306-7118-7'];

        testCases.forEach(testCase => {
            expect(validation.checkDigit(testCase)).toBeTruthy();
        });
    });

    it('should check checksum digit of ISMN values incorrectly', () => {
        const testCases = ['ISMN 979-0-1234-5678-5', 'THIS IS NOT A VALID ISMN', '12345', 12345];

        testCases.forEach(testCase => {
            expect(validation.checkDigit(testCase)).toBeFalsy();
        });
    });
});

describe('dates', () => {
    describe('isValidDate', () => {
        it('should return true for valid date', () => {
            expect(validation.isValidDate('2000-01-01 00:00:00')).toBeTruthy();
        });

        it('should return false for invalid date', () => {
            expect(validation.isValidDate('2000-13-01 00:00:00')).toBeFalsy();
        });
    });

    describe('isDateSameOrAfter', () => {
        it('should return true when the first given date is same or after the second given date', () => {
            expect(validation.isDateSameOrAfter('2000-01-01', '2000-01-01')).toBeTruthy();
            expect(validation.isDateSameOrAfter('2000-01-02', '2000-01-01')).toBeTruthy();
        });

        it('should return false when the first given date is before the second given date', () => {
            expect(validation.isDateSameOrAfter('1999-12-31', '2000-01-01')).toBeFalsy();
        });
    });

    describe('isDateSameOrBefore', () => {
        it('should return true when the first given date is same or before the second given date', () => {
            expect(validation.isDateSameOrBefore('2000-01-01', '2000-01-01')).toBeTruthy();
            expect(validation.isDateSameOrBefore('1999-12-31', '2000-01-01')).toBeTruthy();
        });

        it('should return false when the first given date is after the second given date', () => {
            expect(validation.isDateSameOrBefore('2000-01-01', '1999-12-31')).toBeFalsy();
        });
    });

    describe('isDateInBetween', () => {
        it('should return true when the first given date is in between the  other given dates', () => {
            expect(validation.isDateInBetween('2000-01-01', '2000-01-01', '2000-01-03')).toBeTruthy();
            expect(validation.isDateInBetween('2000-01-02', '2000-01-01', '2000-01-03')).toBeTruthy();
            expect(validation.isDateInBetween('2000-01-03', '2000-01-01', '2000-01-03')).toBeTruthy();
        });

        it('should return false when the first given date is not in between the other given dates', () => {
            expect(validation.isDateInBetween('1999-12-31', '2000-01-01', '2000-01-03')).toBeFalsy();
            expect(validation.isDateInBetween('2000-01-04', '2000-01-01', '2000-01-03')).toBeFalsy();
        });
    });

    describe('dateRange', () => {
        it('should not return error when start date is before or equal to end date', () => {
            expect(validation.dateRange('2000-01-01 00:00:00', '2000-01-01 00:00:00')).toBeUndefined();
            expect(validation.dateRange('2000-01-01 00:00:00', '2000-01-01 00:00:01')).toBeUndefined();
        });

        it('should return error when start date is after end date', () => {
            expect(validation.dateRange('2000-01-01 00:00:01', '2000-01-01 00:00:00')).toEqual(
                locale.validationErrors.dateRange,
            );
            expect(validation.dateRange('2000-01-01 00:00:01', '2000-01-01 00:00:00', 'error message')).toEqual(
                'error message',
            );
        });
    });
});
