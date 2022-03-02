import { VIEW_COMMUNITIES_LOADING, VIEW_COMMUNITIES_LOADED, VIEW_COMMUNITIES_LOAD_FAILED } from 'actions/actionTypes';

import viewCommunitiesReducer from './communities';

const initialState = {
    communityList: [],
    loadingCommunities: false,
    loadingCommunitiesError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

describe('viewCommunities reducer', () => {
    it('sets community loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            loadingCommunities: true,
        };
        const test = viewCommunitiesReducer(previousState, { type: VIEW_COMMUNITIES_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets community loaded state', () => {
        const previousState = {
            ...initialState,
            loadingCommunities: true,
        };
        const expected = {
            ...previousState,
            communityList: [{ item: 'test' }],
            loadingCommunities: false,
            startRecord: 1,
            endRecord: 10,
            totalRecords: 10,
        };
        const test = viewCommunitiesReducer(previousState, {
            type: VIEW_COMMUNITIES_LOADED,
            payload: {
                per_page: 10,
                page: 1,
                current_page: 1,
                from: 1,
                to: 10,
                total: 10,
                data: [{ item: 'test' }],
            },
        });
        expect(test).toEqual(expected);
    });

    it('sets community failed state', () => {
        const previousState = {
            ...initialState,
            loadingCommunities: true,
        };
        const expected = {
            ...previousState,
            loadingCommunities: false,
            loadingCommunitiesError: { error: true },
        };
        const test = viewCommunitiesReducer(previousState, {
            type: VIEW_COMMUNITIES_LOAD_FAILED,
            payload: {
                error: true,
            },
        });
        expect(test).toEqual(expected);
    });
});
