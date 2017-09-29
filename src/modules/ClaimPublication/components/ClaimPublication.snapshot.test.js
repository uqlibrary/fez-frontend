jest.dontMock('./ClaimPublication');

import {shallow} from 'enzyme';
import {mount} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ClaimPublication from './ClaimPublication';
import {possibleUnclaimedList} from 'mock/data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider} from 'react-redux';
import Immutable from 'immutable';

beforeAll(() => {
    injectTapEventPlugin();
});

const create = () => {
    const initialState = Immutable.Map();

    const store = {
        getState: jest.fn(() => (initialState)),
        dispatch: jest.fn(),
        subscribe: jest.fn()
    };
    const next = jest.fn();
    const invoke = (action) => thunk(store)(next)(action);
    return {store, next, invoke}
};

function setup({possiblePublicationsList, loadingPossiblePublicationsList, loadingPossibleCounts,
                   possiblePublicationsFacets,
                   account, author, accountLoading, possibleCounts, actions, history, isShallow = true}) {
    const props = {
        possiblePublicationsList: possiblePublicationsList || [],
        possiblePublicationsFacets: possiblePublicationsFacets || {},
        possibleCounts: possibleCounts || 0,
        loadingPossiblePublicationsList: loadingPossiblePublicationsList || false,
        loadingPossibleCounts: loadingPossibleCounts || false,

        account: account || {id: 12345},
        author: author || {aut_id: 12344},
        accountLoading: accountLoading || false,
        actions: actions || {},
        history: history || { push : jest.fn()}
    };

    if(isShallow) {
        return shallow(
            <Provider store={create().store}>
                <ClaimPublication {...props} />
            </Provider>);
    }

    return mount(
        <Provider store={create().store}>
            <ClaimPublication {...props} />
        </Provider>, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

describe('ClaimPublication test', () => {
    it('renders empty list', () => {
        const wrapper = setup({}).find('ClaimPublication').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading author data', () => {
        const wrapper = setup({ authorLoading: true }).find('ClaimPublication').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publications ', () => {
        const wrapper = setup({ author: {}, loadingPossiblePublicationsList: true }).find('ClaimPublication').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders no results', () => {
        const wrapper = setup({ author: {} }).find('ClaimPublication').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications and counts', () => {
        const wrapper = setup({ author: {}, possibleCounts: 5, possiblePublicationsList: possibleUnclaimedList.data }).find('ClaimPublication').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('publication for claiming is selected', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ actions: { setClaimPublication: actionFunction}}).find('ClaimPublication').dive();
        wrapper.instance()._claimPublication({pid: 11111});
        expect(actionFunction).toHaveBeenCalled();
    });

    // TODO: how to set this.confirmBOx ?
    // it('calls confirm publication to be hidden', () => {
    //     const actionFunction = jest.fn();
    //     const wrapper = setup({ isShallow: false, author: {}, actions: { searchPossiblyYourPublications: actionFunction} }).find('ClaimPublication');
    //     expect(wrapper.state().publicationToHide).toBeFalsy();
    //     wrapper.instance()._confirmHidePublication({pid: 1111});
    //     expect(wrapper.state().publicationToHide).toBeTruthy();
    // });

    it('calls componentDidMount', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ isShallow: false, author: {aut_id: 1111}, actions: { searchPossiblyYourPublications: actionFunction} });
        expect(actionFunction).toHaveBeenCalled();
    });

    // TODO: how to set props of sub-component?
    // it('calls componentWillReceiveProps', () => {
    //     const actionFunction = jest.fn();
    //     const wrapper = setup({ isShallow: false, actions: { searchPossiblyYourPublications: actionFunction} });
    //     wrapper.setProps({author: {aut_org_username: 'xyz'});
    //     expect(actionFunction).toHaveBeenCalled();
    // });

    it('calls hide publication', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ author: {}, actions: { hideRecord: actionFunction}}).find('ClaimPublication').dive();
        wrapper.setState({ publicationToHide: {pid: 1111} });
        wrapper.instance()._hidePublication();
        expect(actionFunction).toHaveBeenCalled();
        expect(wrapper.state().publicationToHide).toBeFalsy();
    });
});
