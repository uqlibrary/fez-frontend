import Immutable from 'immutable';
import { mapStateToProps } from './containers/SearchComponent';

describe('mapStateToProps', () => {
    const expected = {
        isAdmin: false,
        isAdvancedSearch: undefined,
        isAdvancedSearchMinimised: undefined,
        isOpenAccessInAdvancedMode: undefined,
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
        expect(mapStateToProps(state, ownProps)).toEqual(expected);
    });
    it('Should parse query string param with value & label', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?searchQueryParams%5Brek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&searchQueryParams%5Brek_ismemberof%5D%5Blabel%5D=IsMemberOf',
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
    it('Should parse query string param with value and empty label', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?searchQueryParams%5Brek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&searchQueryParams%5Brek_ismemberof%5D%5Blabel%5D=',
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
    it('Should parse value only params', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?searchQueryParams%5Brek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&rek_ismemberof%5D%5Blabel%5D=Malformed',
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
    it('should filter out params with label only', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?rek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&searchQueryParams%5Brek_ismemberof%5D%5Blabel%5D=LabelOnly',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual(expected);
    });
    it('should filter out params with empty label only', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search:
                    '?rek_ismemberof%5D%5Bvalue%5D%5B%5D=UQ%3A12345&searchQueryParams%5Brek_ismemberof%5D%5Blabel%5D=',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual(expected);
    });
});
