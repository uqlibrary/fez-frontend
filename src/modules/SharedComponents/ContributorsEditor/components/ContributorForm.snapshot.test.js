jest.dontMock('./ContributorForm');

import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {ContributorForm} from './ContributorForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {authorsSearch} from 'mock/data/authors';

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

function setup({authorsList, onAdd, showIdentifierLookup, actions, disabled, isMount}){

    const props = {
        authorsList: authorsList || [], // : PropTypes.array,
        onAdd: onAdd || jest.fn(), // : PropTypes.func.isRequired,
        showIdentifierLookup: showIdentifierLookup || false, // : PropTypes.bool,
        actions: actions || {}, // : PropTypes.object.isRequired,
        disabled // : PropTypes.bool
        //locale, // : PropTypes.object,
    };

    if (isMount) {
        return mount(
            <Provider store={create().store}>
                <ContributorForm {...props} />
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<Provider store={create().store}><ContributorForm {...props} /></Provider>);
}



describe('ContributorForm tests ', () => {
    it('rendering display name field only', () => {
        const wrapper = setup({ isMount: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('rendering display name field and identifier field', () => {
        const wrapper = setup({ showIdentifierLookup: true, isMount: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('loads authors when value is changed', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ showIdentifierLookup: true, actions: { searchAuthors: testFunction } }).find('ContributorForm').dive();
        wrapper.instance()._onUQIdentifierChanged('smith');
        expect(testFunction).toBeCalled();
    });

    it('sets display name of a contributor ', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ showIdentifierLookup: true, actions: { searchAuthors: testFunction } }).find('ContributorForm').dive();
        expect(wrapper.state.nameAsPublished).toBeFalsy();
        wrapper.instance()._onNameChanged({}, 'J. Smith');
        expect(wrapper.state().nameAsPublished).toEqual('J. Smith');
    });


    it('selects author identifier, calls add contributor ', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ showIdentifierLookup: true, onAdd: testFunction }).find('ContributorForm').dive();
        wrapper.instance()._onUQIdentifierSelected(authorsSearch.data[0], 0);
        expect(testFunction).toBeCalled();
    });

});
