import * as actions from 'actions/actionTypes';
import topCitedPublicationsReducer from './topCitedPublications';

const initialState = {
    topCitedPublicationsList: [],
    loadingTopCitedPublications: false,
};

describe('Top cited publications reducer', () => {
    it('returns the correct state while top cited publications are loading', () => {
        const test = topCitedPublicationsReducer(initialState, { type: actions.TOP_CITED_PUBLICATIONS_LOADING });
        expect(test.topCitedPublicationsList).toEqual([]);
        expect(test.loadingTopCitedPublications).toBeTruthy();
    });

    it('returns the correct state when top cited publications are loaded', () => {
        const source = 'altmetric';
        const data = [{ rek_pid: 'UQ:1' }];
        const test = topCitedPublicationsReducer(initialState, {
            type: `${actions.TOP_CITED_PUBLICATIONS_LOADED}@${source}`,
            payload: { data: data },
        });
        expect(test.topCitedPublicationsList).toEqual([{ key: source, values: data }]);
        expect(test.loadingTopCitedPublications).toBeFalsy();
    });
    it('returns the correct state when top cited publications are loaded and already exist', () => {
        const source = 'altmetric';
        const data = [{ rek_pid: 'UQ:200' }];
        const test = topCitedPublicationsReducer(
            {
                topCitedPublicationsList: [{ key: 'altmetric', values: [{ rek_pid: 'UQ:100' }] }],
                loadingTopCitedPublications: false,
            },
            {
                type: `${actions.TOP_CITED_PUBLICATIONS_LOADED}@${source}`,
                payload: { data: data },
            },
        );
        expect(test.topCitedPublicationsList).toEqual([{ key: source, values: data }]);
        expect(test.loadingTopCitedPublications).toBeFalsy();
    });

    it('returns the correct state when top cited publications are loaded but 0 publications found', () => {
        const test = topCitedPublicationsReducer(initialState, {
            type: actions.TOP_CITED_PUBLICATIONS_LOADED,
            payload: { total: 0, data: [] },
        });
        expect(test.topCitedPublicationsList).toEqual([]);
        expect(test.loadingTopCitedPublications).toBeFalsy();
    });

    it('returns the correct state when top cited publications fail to load', () => {
        const test = topCitedPublicationsReducer(initialState, { type: actions.TOP_CITED_PUBLICATIONS_FAILED });
        expect(test.topCitedPublicationsList).toEqual([]);
        expect(test.loadingTopCitedPublications).toBeFalsy();
    });
});
