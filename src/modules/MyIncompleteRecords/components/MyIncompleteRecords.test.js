import MyIncompleteRecords from './MyIncompleteRecords';
import { routes, general } from 'config';
import { locale } from 'locale';
import { mockRecordToFix } from 'mock/data/testing/records';

function setup(testProps, isShallow = true) {
    const props = {
        actions: {
            searchAuthorPublications: jest.fn(),
            setFixRecord: jest.fn(),
        },
        location: {
            pathname: routes.pathConfig.records.mine,
            state: null
        },
        history: {
            push: jest.fn(),
            go: jest.fn()
        },
        accountLoading: false,
        exportPublicationsLoading: false,
        localePages: locale.pages.myResearch,
        ...testProps,
        incomplete: {
            publicationsListPagingData: {},
            loadingPublicationsList: false,
            publicationsList: [],
            publicationsListFacets: {},
            ...testProps.incomplete
        },
    };
    return getElement(MyIncompleteRecords, props, isShallow);
}

describe('MyIncompleteRecords test', () => {
    it('renders loading screen while loading account data', () => {
        const wrapper = setup({ accountLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publications ', () => {
        const wrapper = setup({ incomplete:
            {
                loadingPublicationsList: true
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publications while filtering', () => {
        const wrapper = setup({
            incomplete: {
                publicationsList: [1, 2, 2]
            }
        });
        wrapper.setProps({
            incomplete: {
                loadingPublicationsList: true
            }
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while export publications loading', () => {
        const wrapper = setup({
            incomplete: {
                publicationsList: [1, 2, 2],
            },
            exportPublicationsLoading: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders no results', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications no facets', () => {
        const wrapper = setup({
            incomplete: {
                publicationsList: [1, 2, 3], // myRecordsList.data,
                publicationsListPagingData: {
                    "total": 147,
                    "per_page": 20,
                    "current_page": 1,
                    "from": 1,
                    "to": 20
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications with facets', () => {
        const wrapper = setup({
            incomplete: {
                publicationsList: [1, 2, 3], // myRecordsList.data,
                publicationsListPagingData: {
                    "total": 147,
                    "per_page": 20,
                    "current_page": 1,
                    "from": 1,
                    "to": 20
                },
                publicationsListFacets: {
                    "Display type": {
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 3,
                        "buckets": [
                            { "key": 179, "doc_count": 95 },
                            { "key": 130, "doc_count": 34 },
                            { "key": 177, "doc_count": 2 },
                            { "key": 183, "doc_count": 2 },
                            { "key": 174, "doc_count": 1 }
                        ]
                    },
                    "Keywords": {
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 641,
                        "buckets": [
                            { "key": "Brca1", "doc_count": 15 },
                            { "key": "Oncology", "doc_count": 15 },
                            { "key": "Breast cancer", "doc_count": 13 },
                            { "key": "Genetics & Heredity", "doc_count": 12 },
                            { "key": "Biochemistry & Molecular Biology", "doc_count": 10 }
                        ]
                    }
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders active filters', () => {
        const wrapper = setup({
            location: {
                state: {
                    activeFacets: {
                        filters: {},
                        ranges: {
                            Year: {
                                from: 2000,
                                to: 2010
                            }
                        }
                    }
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('state is updated by sub components', () => {
        const testAction = jest.fn();
        const wrapper = setup({
            actions: {
                searchAuthorPublications: testAction
            }
        });

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

        wrapper.instance().facetsChanged({ 'foo': 'bar' });
        expect(wrapper.state().activeFacets).toEqual({ 'foo': 'bar' });
        expect(wrapper.state().page).toEqual(1);
        expect(testAction).toHaveBeenCalled();
    });

    it('sets forever true has publications on load', () => {
        const wrapper = setup({
            location: {
                state: {
                    page: 2,
                    hasPublications: true
                }
            }
        });
        expect(wrapper.state().hasPublications).toEqual(true);
        expect(wrapper.state().page).toEqual(2);
    });

    it('sets forever true has publications', () => {
        const wrapper = setup({ incomplete: { loadingPublicationsList: true }});
        expect(wrapper.state().hasPublications).toEqual(false);

        wrapper.instance().componentWillReceiveProps({
            incomplete: {
                loadingPublicationsList: false,
                publicationsList: [1, 2, 3],
            },
            history: {},
            location: {}
        });
        expect(wrapper.state().hasPublications).toEqual(true);
    });

    it('gets publications when user clicks back and state is set', () => {
        const testAction = jest.fn();
        const wrapper = setup({
            accountLoading: true,
            actions: {
                searchAuthorPublications: testAction
            },
            thisUrl: routes.pathConfig.records.mine
        });

        wrapper.instance().componentWillReceiveProps({
            history: { action: 'POP' },
            location: {
                pathname: routes.pathConfig.records.mine,
                state: {
                    page: 2,
                    hasPublications: true
                }
            }
        });
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().hasPublications).toEqual(true);
        expect(wrapper.state().page).toEqual(2);

    });

    it('gets publications when user clicks back and state is not set', () => {
        const testAction = jest.fn();
        const wrapper = setup({
            accountLoading: true,
            actions: {
                searchAuthorPublications: testAction
            },
            thisUrl: routes.pathConfig.records.mine
        });
        wrapper.instance().componentWillReceiveProps({
            history: { action: 'POP' },
            location: {
                pathname: routes.pathConfig.records.mine,
                state: null
            },
            incomplete: {
                loadingPublicationsList: false,
                publicationsList: [],
            }
        });
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().page).toEqual(1);
    });

    it('doesn\'t retrieve data from history if user navigates to next page', () => {
        const testAction = jest.fn();
        const wrapper = setup({
            accountLoading: true,
            actions: {
                searchAuthorPublications: testAction
            }
        });

        wrapper.instance().componentWillReceiveProps({
            history: { action: 'PUSH' },
            location: { pathname: routes.pathConfig.records.mine },
            incomplete: {
                loadingPublicationsList: false,
                publicationsList: [],
            }
        });
        expect(testAction).not.toHaveBeenCalled();
    });

    // it('sets publication to fix', () => {
    //     const push = jest.fn();
    //     const setFixRecord = jest.fn();
    //     const wrapper = setup({accountLoading: true, actions: {setFixRecord: setFixRecord},  history: {push: push}});
    //     wrapper.instance().completeRecord({rek_pid: 'UQ:111111'});
    //     expect(push).toHaveBeenCalledWith(routes.pathConfig.records.incompleteFix('UQ:111111'));
    //     expect(setFixRecord).toHaveBeenCalled();
    // });

    it('component has displayable facets', () => {
        const testAction = jest.fn();
        const wrapper = setup({ actions: { searchAuthorPublications: testAction } });

        wrapper.instance().facetsChanged({
            'filters': {
                'Display type': general.PUBLICATION_TYPE_CREATIVE_WORK
            }
        });

        expect(wrapper.state().activeFacets).toEqual({
            "filters": {
                "Display type": general.PUBLICATION_TYPE_CREATIVE_WORK
            }
        });
        expect(wrapper.state().page).toEqual(1);
        expect(testAction).toHaveBeenCalled();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should complete record', () => {
        const testMethod = jest.fn();
        const goBack = jest.fn();

        const wrapper = setup({
            recordToFix: mockRecordToFix,
            history: {
                push: testMethod,
                goBack: goBack
            }
        });
        const item = { rek_pid: 'UQ:1001' };
        wrapper.instance().completeRecord(item);
        expect(testMethod).toHaveBeenCalledWith('/records/UQ:1001/incomplete');
    });
});
