jest.dontMock('./Research');

import {shallow} from 'enzyme';
import {mount} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Research from './Research';
import * as mock from 'mock/data';
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

function setup({publicationsList, publicationsListFacets, loadingPublicationsList, publicationsListPagingData,
                   account, accountLoading, actions, history, isShallow = true}) {
    const props = {
        publicationsList: publicationsList || [], // PropTypes.array,
        publicationsListFacets: publicationsListFacets || {}, // PropTypes.object,
        loadingPublicationsList: loadingPublicationsList || false, // PropTypes.bool,
        publicationsListPagingData: publicationsListPagingData || {}, //PropTypes.object,

        account: account || {id: 'fred'}, // PropTypes.object,
        accountLoading: accountLoading || false, // PropTypes.bool,

        actions: actions || {searchAuthorPublications: jest.fn()},
        history: history || {}
    };

    if(isShallow) {
        return shallow(
            <Provider store={create().store}>
                <Research {...props} />
            </Provider>);
    }

    return mount(
        <Provider store={create().store}>
            <Research {...props} />
        </Provider>, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

describe('Research test', () => {
    it('renders no results', () => {
        const wrapper = setup({}).find('Research').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading account data', () => {
        const wrapper = setup({ accountLoading: true }).find('Research').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publications ', () => {
        const wrapper = setup({ loadingPublicationsList: true }).find('Research').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications', () => {
        const wrapper = setup({ publicationsList: mock.claimedPublications.data }).find('Research').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('state is updated', () => {
        const wrapper = setup({}).find('Research').dive();

        wrapper.instance().pageSizeChanged(100);
        expect(wrapper.state().pageSize).toEqual(100);
        expect(wrapper.state().page).toEqual(1);

        wrapper.instance().pageChanged(2);
        expect(wrapper.state().page).toEqual(2);

        wrapper.instance().sortByChanged('foo', 'bar');
        expect(wrapper.state().sortBy).toEqual('foo');
        expect(wrapper.state().sortDirection).toEqual('bar');

        wrapper.instance().facetsChanged({'foo': 'bar'});
        expect(wrapper.state().activeFacets).toEqual({'foo': 'bar'});
        expect(wrapper.state().page).toEqual(1);

    });

    it('actions are called', () => {
        const testFunction = jest.fn();
        const wrapper = setup({isShallow: false, actions: {searchAuthorPublications: testFunction}});
        expect(testFunction).toHaveBeenCalled();
    });

    it('componentWillReceiveProps is called', () => {
        const wrapper = setup({}).find('Research').dive();
        expect(wrapper.state().allowResultsPaging).toEqual(false);
        wrapper.instance().componentWillReceiveProps({loadingPublicationsList: false, publicationsList: mock.claimedPublications.data});
        expect(wrapper.state().allowResultsPaging).toEqual(true);
    });
});
