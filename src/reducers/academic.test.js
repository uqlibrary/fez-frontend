import academicStatsReducer from './academic';
import * as actions from 'actions/actionTypes';

export const initialState = {
    loadingPublicationsByYear: true,
    publicationsByYear: null,
    publicationTypesCount: null,
    loadingPublicationsStats: true,
    publicationsStats: null,
    publicationTotalCount: null,
};

describe('academicStatsReducer', () => {
    describe('updates store correctly when', () => {
        it('current author stats loading', () => {
            const state = academicStatsReducer(initialState, { type: actions.AUTHOR_PUBLICATIONS_STATS_LOADING });
            expect(state).toEqual(initialState);
            expect(state.loadingPublicationsByYear).toBeTruthy();
        });

        it('current author publications by year loaded', () => {
            const oldState = { ...initialState, loadingPublicationsByYear: true };
            const payload = [1, 2, 3, 4, 5];
            const state = academicStatsReducer(oldState, {
                type: actions.AUTHOR_PUBLICATIONS_BY_YEAR_LOADED,
                payload: payload,
            });
            expect(state.loadingPublicationsByYear).toBeFalsy();
            expect(state.publicationsByYear.length).toBe(5);
            expect(state).toEqual(expect.objectContaining({ publicationsByYear: payload }));
        });

        it('current author stats failed', () => {
            const oldState = { ...initialState, loadingPublicationsByYear: true, loadingPublicationsStats: true };
            const state = academicStatsReducer(oldState, { type: actions.AUTHOR_PUBLICATIONS_STATS_FAILED });
            expect(state.loadingPublicationsByYear).toBeFalsy();
            expect(state.loadingPublicationsStats).toBeFalsy();
            expect(state.publicationsByYear).toBe(null);
            expect(state.publicationsStats).toBe(null);
        });

        it('current author publication types count loaded', () => {
            const oldState = { ...initialState };
            const state = academicStatsReducer(oldState, {
                type: actions.AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED,
                payload: { popular: 10, mostViewed: 5 },
            });
            expect(state).toEqual(expect.objectContaining({ publicationTypesCount: { popular: 10, mostViewed: 5 } }));
        });

        it('current author stats loaded', () => {
            const oldState = { ...initialState, loadingPublicationsStats: true };
            const payload = [1, 2, 3, 4, 5];
            const state = academicStatsReducer(oldState, {
                type: actions.AUTHOR_PUBLICATIONS_STATS_LOADED,
                payload: payload,
            });
            expect(state.loadingPublicationsStats).toBeFalsy();
            expect(state.publicationsStats.length).toBe(5);
            expect(state).toEqual(expect.objectContaining({ publicationsStats: payload }));
        });

        it('current author article count loaded', () => {
            const oldState = { ...initialState };
            const payload = {
                articleCount: 100,
                articleFirstYear: '1998',
                articleLastYear: '2019',
            };
            const state = academicStatsReducer(oldState, {
                type: actions.AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED,
                payload: payload,
            });
            expect(state.publicationTotalCount).toEqual({
                articleCount: 100,
                articleFirstYear: '1998',
                articleLastYear: '2019',
            });
        });
    });

    it('does not find handler', () => {
        const state = academicStatsReducer(undefined, { type: 'INVALID_ACTION_TYPE' });
        expect(state).toEqual(initialState);
    });
});
