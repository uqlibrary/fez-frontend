import {AUTHOR_DETAILS_LOADING, AUTHOR_DETAILS_FAILED, AUTHOR_DETAILS_LOADED} from '../actions';

export const initialState = {
    authorDetailsLoading: true,
    authorDetails: {
        'uqr_id': '',
        'espace_id': '',
        'image_exists': '',
        'username': '',
        'staff_id': '',
        'given_name': '',
        'family_name': '',
        'title': '',
        'scopus_id': '',
        'google_scholar_id': '',
        'researcher_id': '',
        'orcid_id': '',
        'publons_id': '',
        'mypub_url': '',
        'org_units': ['', '', ''],
        'positions': ['', '', ''],
        'espace': {'first_year': 0, 'last_year': 0, 'doc_count': ''}
    }
};

const handlers = {
    [AUTHOR_DETAILS_LOADING]: () => ({
        authorDetailsLoading: true,
        authorDetails: initialState.authorDetails,
    }),

    [AUTHOR_DETAILS_LOADED]: (state, action) => ({
        authorDetailsLoading: false,
        authorDetails: action.payload,
    }),

    [AUTHOR_DETAILS_FAILED]: () => ({
        authorDetailsLoading: false,
        authorDetails: null,
    })
};

export default function authorDetailsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
