import * as actions from 'actions/actionTypes';
import feedbackRecordReducer from './feedbackRecord';
import { initialState } from './feedbackRecord';

describe('feedbackRecord reducer', () => {
    const aMockRecordToFeedback = {
        rek_pid: 'UQ:123456',
        rek_title: 'This is a title',
        rek_description: 'This is a description.',
    };

    it('returns that the publication data is loading', () => {
        const test = feedbackRecordReducer(initialState, { type: actions.FEEDBACK_RECORD_LOADING });
        expect(test.loadingRecordToFeedback).toBeTruthy();
        expect(test.recordToFeedback).toBeNull();
        expect(test.recordToFeedbackError).toBeNull();
    });

    it('returns a record to be fixed', () => {
        const test = feedbackRecordReducer(initialState, {
            type: actions.FEEDBACK_RECORD_LOADED,
            payload: aMockRecordToFeedback,
        });
        expect(test.loadingRecordToFeedback).toBeFalsy();
        expect(test.recordToFeedback).toEqual(aMockRecordToFeedback);
        expect(test.recordToFeedbackError).toBeNull();
    });

    it('returns that it has failed to return data', () => {
        const errorMsg = 'This is an error';
        const test = feedbackRecordReducer(initialState, {
            type: actions.FEEDBACK_RECORD_LOAD_FAILED,
            payload: errorMsg,
        });
        expect(test.recordToFeedback).toBeNull();
        expect(test.loadingRecordToFeedback).toBeFalsy();
        expect(test.recordToFeedbackError).toEqual(errorMsg);
    });

    it('returns just the initialState after clearing the record', () => {
        const test = feedbackRecordReducer(initialState, { type: actions.FEEDBACK_RECORD_CLEAR });
        expect(test).toEqual(initialState);
    });

    it('returns just the initialState if the action type is invalid', () => {
        const test = feedbackRecordReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
