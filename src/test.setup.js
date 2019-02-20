/* eslint-env jest */
import React from 'react';

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import 'babel-polyfill';

import {Provider} from 'react-redux';
import Immutable from 'immutable';
import {MemoryRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import {api, mui1theme} from 'config';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

jest.mock('material-ui-pickers/utils/moment-utils');

import MomentUtils from 'material-ui-pickers/utils/moment-utils';

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

const setupMockAdapter = () => {
    return new MockAdapter(api, {delayResponse: 100});
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
            if(item.type !==  expectedActions[index]) {
                pass = false;
                return;
            }
        });
    }
    return {
        message: () => `received actions don't match expected actions [${actions.map(action => (action.type))}] vs [${expectedActions.map(action => (action))}]`,
        pass: pass
    };
};

// for Promise.all - responses can come back out of order
const toHaveAnyOrderDispatchedActions = (actions, expectedActions) => {
    let pass = actions.length === expectedActions.length;
    if (pass) {
        const sortedActions = actions.sort((a, b) => (a.type > b.type ? -1 : 1));
        const sortedExpectedActions = expectedActions.sort((a, b) => (a > b ? -1 : 1));

        sortedActions.map((item, index) => {
            if(item.type !==  sortedExpectedActions[index]) {
                pass = false;
                return;
            }
        });
    }
    return {
        message: () => `received actions don't match expected actions [${actions.map(action => (action.type))}] vs [${expectedActions.map(action => (action))}]`,
        pass: pass
    };
};

// usage in test:
// extend expect to check actions
// expect.extend({toHaveDispatchedActions});
// expect(store.getActions()).toHaveDispatchedActions(expectedActions);

// get a mounted or shallow element
const getElement = (component, props, isShallow = true, requiresStore = false) => {
    if (isShallow) {
        if (requiresStore) {
            return shallow(
                <Provider store={setupStoreForMount().store}>
                    {React.createElement(component, props)}
                </Provider>
            );
        } else {
            return shallow(
                React.createElement(component, props)
            );
        }
    }
    return mount(
        <Provider store={setupStoreForMount().store}>
            <MemoryRouter initialEntries={[ { pathname: '/', key: 'testKey' } ]}>
                <MuiThemeProvider theme={mui1theme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        {React.createElement(component, props)}
                    </MuiPickersUtilsProvider>
                </MuiThemeProvider>
            </MemoryRouter>
        </Provider>
    );
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

// set global store for testing actions
global.setupStoreForActions = setupStoreForActions;
global.mockActionsStore = setupStoreForActions();

// set global mock api
global.setupMockAdapter = setupMockAdapter;
global.mockApi = setupMockAdapter();

// expect extension
global.toHaveDispatchedActions = toHaveDispatchedActions;
global.toHaveAnyOrderDispatchedActions = toHaveAnyOrderDispatchedActions;
jest.spyOn(Date, 'now').mockImplementation(() => 1451606400000);

const MockDate = require('mockdate');
MockDate.set('1/1/2017');
