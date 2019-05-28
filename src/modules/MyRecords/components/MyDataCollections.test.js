import myDatasets from './MyRecords';
import {routes} from 'config';
import {locale} from 'locale';

function setup(testProps, isShallow = true) {
    const props = {
        actions: {
            loadAuthorPublications: jest.fn(),
            setFixRecord: jest.fn(),
        },
        location: {
            pathname: routes.pathConfig.dataset.mine,
            state: null
        },
        history: {
            push: jest.fn(),
            go: jest.fn()
        },
        accountLoading: false,
        localePages: locale.pages.myDatasets,
        publicationsListPagingData: {},
        loadingPublicationsList: false,
        publicationsList: [],
        publicationsListFacets: {},
        ...testProps,
    };
    return getElement(myDatasets, props, isShallow);
}

describe('myDatasets test', () => {
    it('renders loading screen while loading account data', () => {
        const wrapper = setup({ accountLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publications ', () => {
        const wrapper = setup({ loadingPublicationsList: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publications while filtering', () => {
        const wrapper = setup({ publicationsList: [1, 2, 2] });
        wrapper.setProps({ loadingPublicationsList: true });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders no results', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications no facets', () => {
        const wrapper = setup({
            publicationsList: [1, 2, 3], // myRecordsList.data,
            publicationsListPagingData: {"total": 2, "per_page": 20, "current_page": 1, "from": 1,"to": 2},
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications with facets', () => {
        const wrapper = setup({
            publicationsList: [1, 2, 3], // myRecordsList.data,
            publicationsListPagingData: {"total": 2, "per_page": 20, "current_page": 1, "from": 1,"to": 2},
            publicationsListFacets: {
                "Display type": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 3,
                    "buckets": [{"key": 179, "doc_count": 95}, {"key": 130, "doc_count": 34}, {
                        "key": 177,
                        "doc_count": 2
                    }, {"key": 183, "doc_count": 2}, {"key": 174, "doc_count": 1}]
                },
                "Keywords": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 641,
                    "buckets": [{"key": "Brca1", "doc_count": 15}, {
                        "key": "Oncology",
                        "doc_count": 15
                    }, {"key": "Breast cancer", "doc_count": 13}, {
                        "key": "Genetics & Heredity",
                        "doc_count": 12
                    }, {"key": "Biochemistry & Molecular Biology", "doc_count": 10}]
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders active filters', () => {
        const wrapper = setup({state: {activeFacets: {filters: {}, ranges: {Year: {from: 2000, to: 2010}}}}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });


    it('state is updated by sub components', () => {
        const testAction = jest.fn();
        const wrapper = setup({actions: {loadAuthorPublications: testAction}});

        wrapper.instance().pageSizeChanged(100);
        expect(wrapper.state().pageSize).toEqual(100);
        expect(wrapper.state().page).toEqual(1);
        expect(testAction).toHaveBeenCalled();

        wrapper.instance().pageChanged(2);
        expect(wrapper.state().page).toEqual(2);
        expect(testAction).toHaveBeenCalled();

        wrapper.instance().sortByChanged('foo', 'bar');
        expect(wrapper.state().sortBy).toEqual('foo');
        expect(wrapper.state().sortDirection).toEqual('bar');
        expect(testAction).toHaveBeenCalled();

        wrapper.instance().facetsChanged({'foo': 'bar'});
        expect(wrapper.state().activeFacets).toEqual({'foo': 'bar'});
        expect(wrapper.state().page).toEqual(1);
        expect(testAction).toHaveBeenCalled();
    });

    it('sets forever true has publications on load', () => {
        const wrapper = setup({location: { state: {page: 2, hasPublications: true}} });
        expect(wrapper.state().hasPublications).toEqual(true);
        expect(wrapper.state().page).toEqual(2);
    });

    it('sets forever true has publications', () => {
        const wrapper = setup({ loadingPublicationsList: true, publicationsList: [] });
        expect(wrapper.state().hasPublications).toEqual(false);

        wrapper.instance().componentWillReceiveProps({ loadingPublicationsList: false, publicationsList: [1,2,3], history: {}, location: {}});
        expect(wrapper.state().hasPublications).toEqual(true);
    });

    it('gets publications when user clicks back and state is set', () => {
        const testAction = jest.fn();
        const wrapper = setup({accountLoading: true, actions: {loadAuthorPublications: testAction}, thisUrl: routes.pathConfig.dataset.mine});

        wrapper.instance().componentWillReceiveProps({
            history: {action: 'POP'},
            location: {pathname: routes.pathConfig.dataset.mine, state: {page: 2, hasPublications: true}},
            publicationsListPagingData: {},
            loadingPublicationsList: false,
            publicationsList: [],
            publicationsListFacets: {},
        });
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().hasPublications).toEqual(true);
        expect(wrapper.state().page).toEqual(2);

    });

    it('gets publications when user clicks back and state is not set', () => {
        const testAction = jest.fn();
        const wrapper = setup({accountLoading: true, actions: {loadAuthorPublications: testAction}, thisUrl: routes.pathConfig.dataset.mine});
        wrapper.instance().componentWillReceiveProps({
            history: { action: 'POP'},
            location: {pathname: routes.pathConfig.dataset.mine, state: null},
            publicationsListPagingData: {},
            loadingPublicationsList: false,
            publicationsList: [],
            publicationsListFacets: {},
        });
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().page).toEqual(1);
    });

    it('doesn\'t retrieve data from history if user navigates to next page', () => {
        const testAction = jest.fn();
        const wrapper = setup({accountLoading: true, actions: {loadAuthorPublications: testAction}});

        wrapper.instance().componentWillReceiveProps({history: { action: 'PUSH'}, location: {pathname: routes.pathConfig.dataset.mine}, mine: {}});
        expect(testAction).not.toHaveBeenCalled();
    });

    it('sets publication to fix', () => {
        const push = jest.fn();
        const setFixRecord = jest.fn();
        const wrapper = setup({accountLoading: true, actions: {setFixRecord: setFixRecord},  history: {push: push}});
        wrapper.instance().fixRecord({rek_pid: 'UQ:111111'});
        expect(push).toHaveBeenCalledWith(routes.pathConfig.records.fix('UQ:111111'));
        expect(setFixRecord).toHaveBeenCalled();
    });
});
