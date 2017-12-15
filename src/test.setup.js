import React from 'react';
import PropTypes from 'prop-types';

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import toJson from 'enzyme-to-json';
import 'babel-polyfill';

import {Provider} from 'react-redux';
import Immutable from 'immutable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {MemoryRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';

const setupStoreForActions = () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    return mockStore({});
};
const setupStoreForMount = () => {
    const initialState = Immutable.Map();

    const store = {
        getState: jest.fn(() => (initialState)),
        dispatch: jest.fn(),
        subscribe: jest.fn()
    };
    const next = jest.fn();
    const invoke = (action) => thunk(store)(next)(action);
    return {store, next, invoke};
};

// it's possible to extend expect globally,
// but that expect requires extra babel settings not compatible with the other components :-(
// import expect from 'expect';
// expect.extend({toHaveBla(input, output) { ... }})
// extensions for expect
const toHaveDispatchedActions = (actions, expectedActions) => {
    let pass = actions.length === expectedActions.length;
    if (pass) {
        actions.map((item, index) => {
            if(item.type !==  expectedActions[index].type) {
                pass = false;
                return;
            }
        });
    }
    return {
        message: () => 'received actions don\'t match expected actions',
        pass: pass
    };
};
// usage in test:
// extend expect to check actions
// expect.extend({toHaveDispatchedActions});
// expect(store.getActions()).toHaveDispatchedActions(expectedActions);

// get a mounted or shallow element
const getElement = (component, props, isShallow = true) => {
    if (isShallow) return shallow(React.createElement(component, props));
    return mount(
        <Provider store={setupStoreForMount().store}>
            <MemoryRouter>
                {React.createElement(component, props)}
            </MemoryRouter>
        </Provider>,
        {
            context: {
                muiTheme: getMuiTheme()
            },
            childContextTypes: {
                muiTheme: PropTypes.object.isRequired
            }
        });
};

// React Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.toJson = toJson;

// make standard libraries/methods globally available to all tests
global.getElement = getElement;
global.setupStoreForActions = setupStoreForActions;
global.MockAdapter = MockAdapter;
global.toHaveDispatchedActions = toHaveDispatchedActions;
