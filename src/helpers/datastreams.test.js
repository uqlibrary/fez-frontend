import { generatePKString, getAdvisoryStatement, getSensitiveHandlingNote, isDerivative } from './datastreams';
import { SENSITIVE_HANDLING_NOTE_OTHER_TYPE, SENSITIVE_HANDLING_NOTE_TYPE } from '../config/general';

describe('datastream derivative helpers', () => {
    it('generatePKString', () => {
        expect(generatePKString('UQ:1', 'cat.png')).toEqual('uq1-catpng');
    });

    it('is not Derivative', () => {
        const datastream = {
            dsi_dsid: 'test7.txt',
        };
        const actual = isDerivative(datastream);
        expect(actual).toEqual(false);
    });

    it('is Derivative', () => {
        const datastream = {
            dsi_dsid: 'preview_test8.txt',
        };
        const actual = isDerivative(datastream);
        expect(actual).toEqual(true);
    });

    it("getAdvisoryStatement should return record's value when present", () => {
        const expected = 'test';
        const actual = getAdvisoryStatement({
            fez_record_search_key_advisory_statement: { rek_advisory_statement: expected },
        });
        expect(actual).toEqual(expected);
    });

    it("getAdvisoryStatement should return given default when record's value is not present", () => {
        const expected = 'default';
        const actual = getAdvisoryStatement(null, expected);
        expect(actual).toEqual(expected);
    });

    it("getSensitiveHandlingNote should sensitive handling note's text", () => {
        const option = SENSITIVE_HANDLING_NOTE_TYPE.find(item => item.text !== 'Other').text;
        const actual = getSensitiveHandlingNote({
            fez_record_search_key_sensitive_handling_note_id: {
                rek_sensitive_handling_note_id: option.value,
            },
            fez_record_search_key_sensitive_handling_note_other: {
                rek_sensitive_handling_note_other: 'other',
            },
        });
        expect(actual).toEqual(option.text);
    });

    it('getSensitiveHandlingNote should sensitive handling note other text', () => {
        const expected = 'other';
        const actual = getSensitiveHandlingNote({
            fez_record_search_key_sensitive_handling_note_id: {
                rek_sensitive_handling_note_id: SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
            },
            fez_record_search_key_sensitive_handling_note_other: {
                rek_sensitive_handling_note_other: expected,
            },
        });
        expect(actual).toEqual(expected);
    });
});
