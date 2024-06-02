import Immutable from 'immutable';
import { mapStateToProps } from './containers/SearchComponent';

describe('mapStateToProps', () => {
    const expected = {
        isAdmin: false,
        isAdvancedSearch: true,
        isAdvancedSearchMinimised: undefined,
        isOpenAccessInAdvancedMode: false,
        isUnpublishedBufferPage: false,
        searchQueryParams: {},
    };

    it('should handle non-decodable characters in URI', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search: '?q=%E0%A4%A',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual({
            ...expected,
            isAdvancedSearch: undefined,
            isOpenAccessInAdvancedMode: undefined,
        });
    });
    it('Should parse QS params for advanced search with value and label', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?searchMode=advanced&searchQueryParams%5Brek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&searchQueryParams%5Brek_ismemberof%5D%5Blabel%5D=IsMemberOf',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual({
            ...expected,
            searchQueryParams: {
                rek_ismemberof: {
                    label: 'IsMemberOf',
                    value: ['UQ:12345'],
                },
            },
        });
    });
    it('Should parse QS params for advanced search with value and empty label', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?searchMode=advanced&searchQueryParams%5Brek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&searchQueryParams%5Brek_ismemberof%5D%5Blabel%5D=',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual({
            ...expected,
            searchQueryParams: {
                rek_ismemberof: {
                    label: '',
                    value: ['UQ:12345'],
                },
            },
        });
    });
    it('Should parse QS params for advanced search with value only params', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?searchMode=advanced&searchQueryParams%5Brek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&rek_ismemberof%5D%5Blabel%5D=Malformed',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual({
            ...expected,
            searchQueryParams: {
                rek_ismemberof: {
                    value: ['UQ:12345'],
                },
            },
        });
    });
    it('should remove QS params for advanced search with label only', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?searchMode=advanced&rek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&searchQueryParams%5Brek_ismemberof%5D%5Blabel%5D=LabelOnly',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual(expected);
    });
    it('should remove QS params for advanced search with empty label only', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?searchMode=advanced&rek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&searchQueryParams%5Brek_ismemberof%5D%5Blabel%5D=',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual(expected);
    });
});
