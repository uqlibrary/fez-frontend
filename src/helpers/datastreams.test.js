import {
    getAdvisoryStatement,
    getAvState,
    getAvStateDescription,
    getSensitiveHandlingNote,
    isDerivative,
} from './datastreams';
import {
    AV_CHECK_STATE_CLEAN,
    AV_CHECK_STATE_DEFAULT,
    AV_CHECK_STATE_INFECTED,
    AV_CHECK_STATE_UNSCANNABLE,
    SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
    SENSITIVE_HANDLING_NOTE_TYPE,
} from '../config/general';

describe('datastream derivative helpers', () => {
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

    it('getAvState', () => {
        expect(getAvState(undefined)).toEqual(AV_CHECK_STATE_DEFAULT);
        expect(getAvState(AV_CHECK_STATE_CLEAN)).toEqual(AV_CHECK_STATE_CLEAN);
        expect(getAvState(AV_CHECK_STATE_UNSCANNABLE)).toEqual(AV_CHECK_STATE_UNSCANNABLE);
        expect(getAvState(AV_CHECK_STATE_INFECTED)).toEqual(AV_CHECK_STATE_INFECTED);
    });

    it('getAvStateDescription', () => {
        const checkedAt = '2001-01-01 00:00:00';
        expect(getAvStateDescription()).toMatchSnapshot();
        expect(getAvStateDescription(AV_CHECK_STATE_CLEAN, checkedAt)).toMatchSnapshot();
        expect(getAvStateDescription(AV_CHECK_STATE_UNSCANNABLE, checkedAt)).toMatchSnapshot();
        expect(getAvStateDescription(AV_CHECK_STATE_INFECTED, checkedAt)).toMatchSnapshot();
    });
});
