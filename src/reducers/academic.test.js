import academicStatsReducer from './academic';
import * as actions from 'actions/actionTypes';

export const initialState = {
    loadingPublicationsByYear: true,
    publicationsByYear: null,
    publicationTypesCount: null,
    loadingPublicationsStats: true,
    publicationsStats: null
};

describe('academicStatsReducer', () => {
    describe('updates store correctly when', () => {
        describe('academic publications by year', () => {
            it('loading', () => {
                const state = academicStatsReducer(initialState, {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING});
                expect(state).toEqual(initialState);
                expect(state.loadingPublicationsByYear).toBeTruthy();
            });

            it('loaded', () => {
                const oldState = {...initialState, loadingPublicationsByYear: true};
                const payload = [1, 2, 3, 4, 5];
                const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED, payload: payload});
                expect(state.loadingPublicationsByYear).toBeFalsy();
                expect(state.publicationsByYear.length).toBe(5);
                expect(state).toEqual(expect.objectContaining({publicationsByYear: payload}));
            });

            it('failed', () => {
                const oldState = {...initialState, loadingPublicationsByYear: true};
                const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED});
                expect(state.loadingPublicationsByYear).toBeFalsy();
                expect(state.publicationsByYear).toBe(null);
            });
        });

        describe('academic publication types count', () => {
            it('loaded', () => {
                const oldState = {...initialState};
                const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_COUNT_LOADED, payload: {popular: 10, mostViewed: 5}});
                expect(state).toEqual(expect.objectContaining({publicationTypesCount: {popular: 10, mostViewed: 5}}));
            });
        });

        describe('academic publication stats', () => {
            it('loading', () => {
                const oldState = {...initialState, loadingPublicationsStats: false};
                const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADING});
                expect(state.loadingPublicationsStats).toBeTruthy();
                expect(state.publicationsStats).toBe(null);
            });

            it('loaded', () => {
                const oldState = {...initialState, loadingPublicationsStats: true};
                const payload = [1, 2, 3, 4, 5];
                const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADED, payload: payload});
                expect(state.loadingPublicationsStats).toBeFalsy();
                expect(state.publicationsStats.length).toBe(5);
                expect(state).toEqual(expect.objectContaining({publicationsStats: payload}));
            });

            it('failed', () => {
                const oldState = {...initialState, loadingPublicationsStats: true};
                const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_STATS_FAILED});
                expect(state.loadingPublicationsStats).toBeFalsy();
                expect(state.publicationsStats).toBe(null);
            });
        });
    });

    it('does not find handler', () => {
        const state = academicStatsReducer(undefined, {type: 'INVALID_ACTION_TYPE'});
        expect(state).toEqual(initialState);
    });
});