import Immutable from 'immutable';
import { mapStateToProps } from './containers/SearchComponent';

describe('mapStateToProps', () => {
    it('should handle non-decodable characters in URI', () => {
        const state = Immutable.Map({});
        const ownProps = {
            location: {
                search: '?q=%E0%A4%A',
            },
        };
        expect(mapStateToProps(state, ownProps)).toEqual({
            isAdmin: false,
            isAdvancedSearch: undefined,
            isAdvancedSearchMinimised: undefined,
            isOpenAccessInAdvancedMode: undefined,
            isUnpublishedBufferPage: false,
            searchQueryParams: {},
        });
    });
});
