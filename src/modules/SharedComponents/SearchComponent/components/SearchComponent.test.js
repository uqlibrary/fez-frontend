import SearchComponent from './SearchComponent';

function setup(testProps, isShallow = true){
    const props = {
        searchQueryParams: {},
        applyInverseStyle: false,
        showAdvancedSearchButton: false,
        history: {
            push: jest.fn()
        },
        actions: {
            searchEspacePublications: jest.fn()
        },
        ...testProps
    };
    return getElement(SearchComponent, props, isShallow);
}

describe('SearchComponent', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render inverse colour-themed view', () => {
        const wrapper = setup({applyInverseStyle: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with advanced search', () => {
        const wrapper = setup({showAdvancedSearchButton: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set search value from prop', () => {
        const wrapper = setup({showAdvancedSearchButton: true, searchQueryParams: {title: 'i feel lucky'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state when receiving new props', () => {
        // componentWillReceiveProps
        const wrapper = setup({showAdvancedSearchButton: true});
        wrapper.instance().componentWillReceiveProps({searchQueryParams: {title: 'i feel lucky'}});
        wrapper.update();
        expect(wrapper.state().searchText).toEqual('i feel lucky');
    });

    // it('should render advanced search', () => {
    //     const wrapper = setup({showAdvancedSearchButton: true});
    //     wrapper.instance().toggleAdvancedSearch();
    //     wrapper.update();
    //     expect(wrapper.state().showAdvancedSearch).toEqual(true);
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    it('should update internal text field state', () => {
        const wrapper = setup({});
        expect(wrapper.state().searchText).toEqual('');

        wrapper.instance().searchTextChanged(null, 'new search value');
        wrapper.update();

        expect(wrapper.state().searchText).toEqual('new search value');
    });

    it('should not submit search if ENTER wasn\'t pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({actions: {searchEspacePublications: testMethod}});

        wrapper.instance().handleSearch({key: 'a'});
        wrapper.update();

        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const testHistoryPushMehtod = jest.fn();
        const wrapper = setup({actions: {searchEspacePublications: testMethod}, history: {push: testHistoryPushMehtod}});

        wrapper.state().searchText = 'i feel lucky';
        wrapper.instance().handleSearch({key: 'Enter'});
        wrapper.update();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMehtod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&searchQueryParams%5Btitle%5D=i+feel+lucky'
        });
    });
});
