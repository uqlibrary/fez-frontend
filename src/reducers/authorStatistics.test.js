import authorStatisticsReducer, { initialState } from './authorStatistics';
import * as actions from 'actions/actionTypes';

describe('authorStatisticsReducer', () => {
    it('returns initial state for unknown action', () => {
        const state = authorStatisticsReducer(undefined, { type: 'UNKNOWN_ACTION' });
        expect(state).toEqual(initialState);
    });

    it('sets loadingAuthorStats true on AUTHOR_STATS_LOADING', () => {
        const state = authorStatisticsReducer(
            { ...initialState, authorStats: { something: true } },
            { type: actions.AUTHOR_STATS_LOADING },
        );
        expect(state).toEqual({ ...initialState, loadingAuthorStats: true });
    });

    it('stores authorStatsByYear on AUTHOR_STATS_BY_YEAR_LOADED', () => {
        const payload = { series: [1, 2], categories: [2020, 2021] };
        const state = authorStatisticsReducer(initialState, { type: actions.AUTHOR_STATS_BY_YEAR_LOADED, payload });
        expect(state.authorStatsByYear).toEqual(payload);
    });

    it('stores authorStatsPerType on AUTHOR_STATS_PER_TYPE_LOADED', () => {
        const payload = [
            ['Journal Article', 100],
            ['Conference Paper', 50],
        ];
        const state = authorStatisticsReducer(initialState, { type: actions.AUTHOR_STATS_PER_TYPE_LOADED, payload });
        expect(state.authorStatsPerType).toEqual(payload);
    });

    it('stores authorStats and clears loading on AUTHOR_STATS_LOADED', () => {
        const payload = { thomson_citation_count_i: { count: 10 }, scopus_citation_count_i: { count: 20 } };
        const state = authorStatisticsReducer(
            { ...initialState, loadingAuthorStats: true },
            { type: actions.AUTHOR_STATS_LOADED, payload },
        );
        expect(state.loadingAuthorStats).toBe(false);
        expect(state.authorStats).toEqual(payload);
    });

    it('resets to initial state on AUTHOR_STATS_FAILED', () => {
        const loadedState = {
            loadingAuthorStats: false,
            authorStatsByYear: { series: [], categories: [] },
            authorStatsPerType: [['Journal Article', 50]],
            authorStats: { thomson_citation_count_i: {}, scopus_citation_count_i: {} },
        };
        const state = authorStatisticsReducer(loadedState, { type: actions.AUTHOR_STATS_FAILED });
        expect(state).toEqual(initialState);
    });
});
