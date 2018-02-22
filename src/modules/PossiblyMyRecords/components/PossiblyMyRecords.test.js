import PossiblyMyRecords from './PossiblyMyRecords';
import {possibleUnclaimedList} from 'mock/data';
import injectTapEventPlugin from 'react-tap-event-plugin';

beforeAll(() => {
    injectTapEventPlugin();
});

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        possiblePublicationsList: testProps.possiblePublicationsList || [],
        possiblePublicationsFacets: testProps.possiblePublicationsFacets || {},
        possibleCounts: testProps.possibleCounts || 0,
        loadingPossiblePublicationsList: testProps.loadingPossiblePublicationsList || false,
        loadingPossibleCounts: testProps.loadingPossibleCounts || false,

        hidePublicationLoading: testProps.hidePublicationLoading || false,
        hidePublicationFailed: testProps.hidePublicationFailed || false,
        hidePublicationFailedErrorMessage: testProps.hidePublicationFailedErrorMessage || null,

        account: testProps.account || {id: 12345},
        author: testProps.author || {aut_id: 12344},
        accountLoading: testProps.accountLoading || false,

        actions: {
            searchPossiblyYourPublications: jest.fn(),
            ...testProps.actions
        },
        history: testProps.history || { push : jest.fn()}
    };
    return getElement(PossiblyMyRecords, props, isShallow);
}

describe('Component PossiblyMyRecords', () => {

    it('renders empty list', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publication data', () => {
        const wrapper = setup({ loadingPossiblePublicationsList: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publication counts', () => {
        const wrapper = setup({ loadingPossibleCounts: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders no results', () => {
        const wrapper = setup({ author: {} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications and counts', () => {
        const wrapper = setup({ author: {}, possibleCounts: 5, possiblePublicationsList: possibleUnclaimedList.data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders alert when the hide pub api fails', () => {
        const wrapper = setup({
            author: {aut_org_username: 'xyz'},
            possibleCounts: 5,
            possiblePublicationsList: possibleUnclaimedList.data,
            hidePublicationFailed: true,
            hidePublicationFailedErrorMessage: 'Test error message'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('publication for claiming is selected', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ actions: { setClaimPublication: actionFunction}});
        wrapper.instance()._claimPublication({pid: 11111});
        expect(actionFunction).toHaveBeenCalled();
    });

    it('loads possible pubs when username has been set', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({actions: { searchPossiblyYourPublications: actionFunction}});
        wrapper.setProps({author: {aut_org_username: 'xyz'}});
        expect(actionFunction).toHaveBeenCalled();
    });

    it('calls componentDidMount', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ isShallow: false, author: {aut_id: 1111}, actions: { searchPossiblyYourPublications: actionFunction} });
        expect(actionFunction).toHaveBeenCalled();
    });

    it('calls hide publication', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ author: {}, actions: { hideRecord: actionFunction}});
        wrapper.setState({ publicationToHide: {pid: 1111} });
        wrapper.instance()._hidePublication();
        expect(actionFunction).toHaveBeenCalled();
        expect(wrapper.state().publicationToHide).toBeFalsy();
    });

    it('calls the action to reset error message and status when leaving the page', () => {
        const resetFn = jest.fn();
        const wrapper = setup({author: {aut_id: 1111}, actions: { hideRecordErrorReset: resetFn} });
        wrapper.unmount();
        expect(resetFn).toHaveBeenCalled();
    });

    it('sets the state when confirming an item to be hidden', () => {
        const pubToHide = {test: 'This is a test'};
        const wrapper = setup({author: {aut_id: 1111}});
        wrapper.instance().hideConfirmationBox = {showConfirmation: jest.fn()};
        wrapper.instance()._confirmHidePublication(pubToHide);
        expect(wrapper.state().publicationToHide).toEqual(pubToHide);
    });

    it('sets the state for activeFacets', () => {
        const facetActive = {test: 'This is a test'};
        const wrapper = setup({author: {aut_id: 1111}});
        wrapper.instance()._facetsChanged(facetActive);
        expect(wrapper.state().activeFacets).toEqual(facetActive);
    });



});
