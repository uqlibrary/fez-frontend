import PossiblyMyRecords from './PossiblyMyRecords';
import { routes } from 'config';

function setup(testProps = {}) {
    const props = {
        possiblePublicationsList: testProps.possiblePublicationsList || [],
        possiblePublicationsFacets: testProps.possiblePublicationsFacets || {},
        possibleCounts: testProps.possibleCounts || 0,

        loadingPossiblePublicationsList: testProps.loadingPossiblePublicationsList || false,
        loadingPossibleCounts: testProps.loadingPossibleCounts || false,

        hidePublicationLoading: testProps.hidePublicationLoading || false,
        hidePublicationFailed: testProps.hidePublicationFailed || false,
        hidePublicationFailedErrorMessage: testProps.hidePublicationFailedErrorMessage || null,

        accountLoading: testProps.accountLoading || false,

        actions: {
            searchPossiblyYourPublications: jest.fn(),
            setClaimPublication: jest.fn(),
        },
        location: {
            pathname: routes.pathConfig.records.possible,
            state: null,
        },
        history: {
            push: jest.fn(),
            go: jest.fn(),
        },
        ...testProps,
    };
    return getElement(PossiblyMyRecords, props);
}

describe('Component PossiblyMyRecords', () => {
    it('renders nothing while account is loading', () => {
        const wrapper = setup({ accountLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders no results', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading component while loading publication data', () => {
        const wrapper = setup({ loadingPossiblePublicationsList: true, loadingPossibleCounts: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publication counts', () => {
        const wrapper = setup({ loadingPossibleCounts: true, loadingPossiblePublicationsList: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications and counts and facets', () => {
        const wrapper = setup({
            possibleCounts: 5,
            possiblePublicationsList: [1, 2, 3],
            possiblePublicationsFacets: {
                'Display type': {
                    doc_count_error_upper_bound: 0,
                    sum_other_doc_count: 3,
                    buckets: [
                        { key: 179, doc_count: 95 },
                        { key: 130, doc_count: 34 },
                        {
                            key: 177,
                            doc_count: 2,
                        },
                        { key: 183, doc_count: 2 },
                        { key: 174, doc_count: 1 },
                    ],
                },
                Keywords: {
                    doc_count_error_upper_bound: 0,
                    sum_other_doc_count: 641,
                    buckets: [
                        { key: 'Brca1', doc_count: 15 },
                        {
                            key: 'Oncology',
                            doc_count: 15,
                        },
                        { key: 'Breast cancer', doc_count: 13 },
                        {
                            key: 'Genetics & Heredity',
                            doc_count: 12,
                        },
                        { key: 'Biochemistry & Molecular Biology', doc_count: 10 },
                    ],
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders alert when the hide pub api fails', () => {
        const wrapper = setup({
            hidePublicationFailed: true,
            hidePublicationFailedErrorMessage: 'Test error message',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should select publication for claiming', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({
            actions: {
                setClaimPublication: actionFunction,
                searchPossiblyYourPublications: jest.fn(),
            },
        });
        wrapper.instance()._claimPublication({ pid: 11111 });
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should load possibly your publications on load', () => {
        const actionFunction = jest.fn();
        setup({
            actions: {
                searchPossiblyYourPublications: actionFunction,
            },
        });
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should set ref for confirmation box', () => {
        const wrapper = setup();
        wrapper.instance()._setHideConfirmationBox(1);
        expect(wrapper.instance().hideConfirmationBox).toEqual(1);
    });

    it('calls hide publication', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({
            actions: {
                hideRecord: actionFunction,
                searchPossiblyYourPublications: jest.fn(),
            },
        });

        // test no-op
        wrapper.instance()._hidePublication();
        expect(actionFunction).not.toBeCalled();

        wrapper.setState({ publicationToHide: { pid: 1111 } });
        wrapper.instance()._hidePublication();
        expect(actionFunction).toHaveBeenCalled();
        expect(wrapper.state().publicationToHide).toBeFalsy();
    });

    it('calls the action to reset error message and status when leaving the page', () => {
        const resetFn = jest.fn();
        const wrapper = setup({
            actions: {
                hideRecordErrorReset: resetFn,
                searchPossiblyYourPublications: jest.fn(),
            },
        });
        wrapper.unmount();
        expect(resetFn).toHaveBeenCalled();
    });

    it('sets the state when confirming an item to be hidden', () => {
        const pubToHide = { test: 'This is a test' };
        const wrapper = setup();
        wrapper.instance().hideConfirmationBox = { showConfirmation: jest.fn() };
        wrapper.instance()._confirmHidePublication(pubToHide);
        expect(wrapper.state().publicationToHide).toEqual(pubToHide);
    });

    it('sets the state for activeFacets', () => {
        const facetActive = { test: 'This is a test' };
        const wrapper = setup();
        wrapper.instance()._facetsChanged(facetActive);
        expect(wrapper.state().activeFacets).toEqual(facetActive);
    });

    it('renders active filters', () => {
        const wrapper = setup({
            location: {
                state: {
                    hasPublications: true,
                    activeFacets: {
                        filters: {},
                        ranges: {
                            Year: {
                                from: 2000,
                                to: 2010,
                            },
                        },
                    },
                },
            },
        });
        expect(wrapper.state().hasPublications).toEqual(true);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('sets forever true has publications', () => {
        const wrapper = setup({ loadingPossiblePublicationsList: true });
        expect(wrapper.state().hasPublications).toEqual(false);

        wrapper.instance().UNSAFE_componentWillReceiveProps({
            loadingPossiblePublicationsList: false,
            possiblePublicationsList: [1, 2, 3],
            history: {},
            location: {},
        });
        expect(wrapper.state().hasPublications).toEqual(true);
    });

    it('gets publications when user clicks back and state is set', () => {
        const testAction = jest.fn();
        const wrapper = setup({
            accountLoading: true,
            actions: {
                searchPossiblyYourPublications: testAction,
            },
        });

        wrapper.instance().UNSAFE_componentWillReceiveProps({
            history: {
                action: 'POP',
            },
            location: {
                pathname: routes.pathConfig.records.possible,
                state: {
                    hasPublications: true,
                    activeFacets: {
                        filters: {},
                        ranges: {
                            Year: {
                                from: 2000,
                                to: 2010,
                            },
                        },
                    },
                },
            },
        });
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().hasPublications).toEqual(true);
        expect(wrapper.state().activeFacets).toEqual({
            filters: {},
            ranges: {
                Year: {
                    from: 2000,
                    to: 2010,
                },
            },
        });

        wrapper.instance().UNSAFE_componentWillReceiveProps({
            history: { action: 'POP' },
            location: { pathname: routes.pathConfig.records.possible, state: null },
        });

        expect(wrapper.state().activeFacets).toEqual({ filters: {}, ranges: {} });
    });

    it('should push sorted state into page history', () => {
        const wrapper = setup();
        const pushFn = jest.spyOn(wrapper.instance(), 'pushPageHistory');
        wrapper.instance().sortByChanged('test1', 'test2');
        const newState = wrapper.state();
        expect(newState.sortBy).toBe('test1');
        expect(newState.sortDirection).toBe('test2');
        expect(pushFn).toHaveBeenCalledTimes(1);
    });

    it('should push changed page into state and page history', () => {
        const wrapper = setup();
        const pushFn = jest.spyOn(wrapper.instance(), 'pushPageHistory');
        wrapper.instance().pageChanged('test');
        const newState = wrapper.state();
        expect(newState.page).toBe('test');
        expect(pushFn).toHaveBeenCalledTimes(1);
    });

    it('should push changed page size into state and page history', () => {
        const wrapper = setup();
        const pushFn = jest.spyOn(wrapper.instance(), 'pushPageHistory');
        wrapper.instance().pageSizeChanged('test');
        const newState = wrapper.state();
        expect(newState.pageSize).toBe('test');
        expect(newState.page).toBe(1);
        expect(pushFn).toHaveBeenCalledTimes(1);
    });

    it('should generate <Alert> when appropriate', () => {
        const wrapper = setup();
        const testFn = wrapper.instance().getAlert;

        expect(testFn({})).toBeNull();

        const test1 = testFn({}, true);
        expect(test1).toMatchSnapshot();

        const test2 = testFn(
            {
                message: msg => 'Alert: ' + msg,
            },
            true,
            'test message',
        );
        expect(test2).toMatchSnapshot();
    });

    it('should handle larger number of pubs than page size', () => {
        const wrapper = setup({
            accountLoading: false,
            possibleCounts: 21,
            loadingPossibleCounts: false,
            possiblePublicationsList: [1],
            loadingPossiblePublicationsList: false,
        });
        wrapper.setState({
            hasPublications: true,
        });
        expect(
            wrapper.find('StandardCard WithStyles(ForwardRef(Grid)) WithStyles(PublicationsListSorting)').length,
        ).toBe(1);
        expect(
            wrapper.find('StandardCard WithStyles(ForwardRef(Grid)) WithStyles(PublicationsListPaging)').length,
        ).toBe(2);
    });
});
