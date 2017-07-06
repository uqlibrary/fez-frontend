import Immutable from 'immutable';

import {PUBLICATION_SUB_TYPES_LOADED} from './actions';
import {RECORD_SUBMITTED, RECORD_SUBMIT_FAILED, RECORD_SUBMITTING, RECORD_SUBMIT_RESET} from 'actions';
// import {actionTypes} from 'redux-form';

const RecordState = {
    clear: {
        submitting: false,
        failed: false,
        submitted: false
    },
    submitting: {
        submitting: true,
        failed: false,
        submitted: false
    },
    failed: {
        submitting: false,
        failed: true,
        submitted: false
    },
    submitted: {
        submitting: false,
        failed: false,
        submitted: true
    }
};

export const initialState = Immutable.fromJS({
    publicationSubTypeList: {},
    recordSubmissionState: RecordState.clear,
    recordSubmissionErrorMessage: undefined
});


const handlers = {

    [PUBLICATION_SUB_TYPES_LOADED]: (state, action) => (state.set('publicationSubTypeList', Immutable.fromJS(action.payload))),

    [RECORD_SUBMITTED]: (state) => (state.set('recordSubmissionState', Immutable.fromJS(RecordState.submitted)).set('recordSubmissionErrorMessage', undefined)),

    [RECORD_SUBMIT_FAILED]: (state, action) => (state.set('recordSubmissionState', Immutable.fromJS(RecordState.failed)).set('recordSubmissionErrorMessage', Immutable.fromJS(action.payload))),

    [RECORD_SUBMITTING]: (state) => (state.set('recordSubmissionState', Immutable.fromJS(RecordState.submitting)).set('recordSubmissionErrorMessage', undefined)),

    [RECORD_SUBMIT_RESET]: (state) => (state.set('recordSubmissionState', Immutable.fromJS(RecordState.clear)).set('recordSubmissionErrorMessage', undefined))
};

export default function journalArticleReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
