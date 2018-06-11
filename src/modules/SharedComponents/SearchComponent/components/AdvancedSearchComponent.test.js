import AdvancedSearchComponent from './AdvancedSearchComponent';
import * as constants from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        searchQueryParams: {},
        className: 'advanced-search',

        isOpenAccessInAdvancedMode: false,
        isAdvancedSearchMinimised: false,

        onSearch: jest.fn(),
        onToggle: jest.fn(),

        ...testProps
    };

    return getElement(AdvancedSearchComponent, props, isShallow);
}

describe('AdvancedSearchComponent', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render minimised view', () => {
        const wrapper = setup({isAdvancedSearchMinimised: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with open access checked', () => {
        const wrapper = setup({isOpenAccessInAdvancedMode: true});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().openAccess).toBeTruthy();
    });

    it('should set search value from prop', () => {
        const wrapper = setup({isOpenAccessInAdvancedMode: true, searchQueryParams: {all: 'i feel lucky'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state when receiving new props', () => {
        // componentWillReceiveProps
        const wrapper = setup({});
        wrapper.instance().componentWillReceiveProps({searchQueryParams: {all: 'i feel lucky'}});
        wrapper.update();
        expect(wrapper.state().fieldRows[0]).toEqual({searchField: 'all', value: 'i feel lucky'});
    });

    it('should set state when receiving new props (minimised view)', () => {
        const wrapper = setup({});
        wrapper.instance().componentWillReceiveProps({isAdvancedSearchMinimised: true});
        wrapper.update();
        expect(wrapper.state().fieldRows[0]).toEqual({searchField: 0, value: ''});
        expect(wrapper.state().minimised).toBeTruthy();
        expect(wrapper.state().fieldRows.length).toEqual(1);
    });

    it('should set state when receiving new props (open access)', () => {
        const wrapper = setup({});
        wrapper.instance().componentWillReceiveProps({isOpenAccessInAdvancedMode: true});
        wrapper.update();
        expect(wrapper.state().fieldRows[0]).toEqual({searchField: 0, value: ''});
        expect(wrapper.state().openAccess).toBeTruthy();
        expect(wrapper.state().fieldRows.length).toEqual(1);
    });

    it('should toggle minimised view for advanced search', () => {
        const wrapper = setup({});
        wrapper.instance().toggleMinimisedView();
        wrapper.update();
        expect(wrapper.state().minimised).toBeTruthy();
    });

    it('should not submit search if ENTER wasn\'t pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onSearch: testMethod});

        wrapper.instance().handleAdvancedSearch({key: 'a'});

        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onSearch: testMethod});

        wrapper.state().fieldRows = [
            {
                searchField: 'all',
                value: 'i feel lucky'
            }
        ];
        wrapper.update();

        wrapper.instance().handleAdvancedSearch({key: 'Enter'});

        expect(testMethod).toHaveBeenCalled();
    });

    it('should submit search with all query parameters correctly if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onSearch: testMethod});

        wrapper.state().fieldRows = [
            {
                searchField: 'all',
                value: 'i feel lucky'
            },
            {
                searchField: 'rek_title',
                value: 'some publication title'
            }
        ];
        wrapper.state().openAccess = true;

        wrapper.update();

        wrapper.instance().handleAdvancedSearch({key: 'Enter'});

        expect(testMethod).toHaveBeenCalledWith({
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'Desc',
            searchQueryParams: {
                all: 'i feel lucky',
                rek_title: 'some publication title'
            },
            activeFacets: {
                filters: {},
                ranges: {},
                showOpenAccessOnly: true
            },
            searchMode: 'advanced'
        });
    });

    it('should reset state of advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: 'i feel lucky',
                rek_title: 'Testing reset'
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().resetAdvancedFields();
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should reset state of open access checkbox', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: 'i feel lucky'
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().toggleOpenAccess({preventDefault: jest.fn()});
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should add one row for advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: 'i feel lucky'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('AdvancedSearchRow').length).toEqual(1);

        wrapper.instance().addAdvancedField();
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('AdvancedSearchRow').length).toEqual(2);
    });

    it('should delete on row from advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: 'i feel lucky',
                rek_title: 'delete rek title field'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().deleteAdvancedField(1);
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('AdvancedSearchRow').length).toEqual(1);
    });

    it('should update advanced search field on search text changed', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: 'i feel lucky'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().handleAdvancedFieldChange(0, {searchField: 'all', value: 'i feel more lucky'});
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update advanced search field on search field changed', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: 'i feel lucky'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().handleAdvancedFieldChange(0, {searchField: 'rek_title', value: 'i feel lucky'});
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle search mode', () => {
        const testToggleFn = jest.fn();
        const wrapper = setup({onToggle: testToggleFn});

        wrapper.instance().handleSearchMode();
        expect(testToggleFn).toHaveBeenCalled();
    });

    describe('_getFieldRowsFromSearchQuery', () => {
        it('should get default field if search query params not set (undefined)', () => {
            const wrapper = setup({});
            const fieldRows = wrapper.instance()._getFieldRowsFromSearchQuery(undefined);

            expect(fieldRows).toEqual([{searchField: 0, value: ''}]);
        });

        it('should get default field if search query params not set (empty object)', () => {
            const wrapper = setup({});
            const fieldRows = wrapper.instance()._getFieldRowsFromSearchQuery({});

            expect(fieldRows).toEqual([{searchField: 0, value: ''}]);
        });

        it('should get field rows from search query params', () => {
            const wrapper = setup({});
            const fieldRows = wrapper.instance()._getFieldRowsFromSearchQuery({
                all: 'test',
                rek_title: 'some title'
            });

            expect(fieldRows).toEqual([
                {
                    searchField: 'all',
                    value: 'test'
                },
                {
                    searchField: 'rek_title',
                    value: 'some title'
                }
            ]);
        });
    });
});
