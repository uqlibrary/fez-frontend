import Immutable from 'immutable';
import {
    CLAIM_SUBMITTING,
    CLAIM_SUBMITTED,
    CLAIM_SUBMIT_FAILED,
    CLAIM_SUBMIT_RESET,
    PUBLICATION_SELECTED,
    PUBLICATION_SELECTED_CLEARED,
    PUBLICATION_RESULTS_CLEARED,
    USERS_PUBLICATIONS_LOADED,
    USERS_PUBLICATIONS_LOADING,
    USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED} from './actions';
import {locale} from 'config';
import {actionTypes} from 'redux-form';

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

// Immutable state
export const initialState = Immutable.fromJS({
    claimPublicationResults: {},
    loadingSearch: false,
    selectedPublication: {},
    recordClaimState: undefined,
    recordClaimErrorMessage: undefined
});

const handlers = {

    [PUBLICATION_SELECTED]: (state, action) => {
        const entry = state.get('claimPublicationResults').find(entry => {
            return entry.get('rek_pid') === action.payload;
        });

        return state.set('selectedPublication', Immutable.fromJS(entry));
    },

    [USERS_PUBLICATIONS_LOADING]: (state) => state.set('loadingSearch', true),

    [PUBLICATION_RESULTS_CLEARED]: (state, action) => state.set('claimPublicationResults', Immutable.fromJS(action.payload)).set('loadingSearch', false),
    [USERS_PUBLICATIONS_LOADED]: (state, action) => state.set('claimPublicationResults', Immutable.fromJS(action.payload)).set('loadingSearch', false),

    [PUBLICATION_SELECTED_CLEARED]: (state, action) => state.set('selectedPublication', Immutable.fromJS(action.payload)),

    [USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED]: (state) => {
        const updatedState = state.get('claimPublicationResults').filter((item, index) => {
            return index >= locale.pages.claimPublications.maxSearchResults;
        });
        return state.set('claimPublicationResults', Immutable.fromJS(updatedState));
    },

    [CLAIM_SUBMITTED]: (state) => (state.set('recordClaimState', Immutable.fromJS(RecordState.submitted)).set('recordClaimErrorMessage', undefined)),

    [CLAIM_SUBMIT_FAILED]: (state, action) => (state.set('recordClaimState', Immutable.fromJS(RecordState.failed)).set('recordClaimErrorMessage', Immutable.fromJS(action.payload))),

    [CLAIM_SUBMITTING]: (state) => (state.set('recordClaimState', Immutable.fromJS(RecordState.submitting)).set('recordClaimErrorMessage', undefined)),

    [CLAIM_SUBMIT_RESET]: (state) => (state.set('recordClaimState', Immutable.fromJS(RecordState.clear)).set('recordClaimErrorMessage', undefined)),

    // TODO: refactor: rely on redux-form failed submission api, not on manual state reset
    // reset failed submit state when user 'starts' to modify something on the form by moving focus
    [actionTypes.FOCUS]: (state) => (state.set('recordClaimState', Immutable.fromJS(RecordState.clear)).set('recordClaimErrorMessage', undefined))
};


export default function claimPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
