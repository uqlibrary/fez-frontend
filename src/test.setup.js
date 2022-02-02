/* eslint-env jest */
import React from 'react';

import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import toJson from 'enzyme-to-json';
import '@babel/polyfill';

import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { mui1theme } from 'config';
import { api, sessionApi } from 'config/axios';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import prettyFormat from 'pretty-format';
import renderer from 'react-test-renderer';

// jest.mock('@date-io/moment');
import MomentUtils from '@date-io/moment';

const setupStoreForActions = () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    return mockStore({});
};

export const setupStoreForMount = (initialState = Immutable.Map()) => {
    const store = {
        getState: jest.fn(() => initialState),
        dispatch: jest.fn(),
        subscribe: jest.fn(),
    };
    const next = jest.fn();
    const invoke = action => thunk(store)(next)(action);
    return { store, next, invoke };
};

const setupMockAdapter = () => {
    return new MockAdapter(api, { delayResponse: 100 });
};

const setupSessionMockAdapter = () => {
    return new MockAdapter(sessionApi, { delayResponse: 100 });
};

// get a mounted or shallow element
const getElement = (component, props, args = {}) => {
    const { isShallow, requiresStore, context, store } = {
        isShallow: true,
        requiresStore: false,
        context: {},
        store: setupStoreForMount().store,
        ...args,
    };

    if (isShallow) {
        if (requiresStore) {
            return shallow(<Provider store={store}>{React.createElement(component, props)}</Provider>, {
                context,
            });
        } else {
            return shallow(React.createElement(component, props), { context });
        }
    }
    return mount(
        <Provider store={store}>
            <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
                <MuiThemeProvider theme={mui1theme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        {React.createElement(component, props)}
                    </MuiPickersUtilsProvider>
                </MuiThemeProvider>
            </MemoryRouter>
        </Provider>,
    );
};

global.componentToString = component => {
    return prettyFormat(renderer.create(component), {
        plugins: [prettyFormat.plugins.ReactTestComponent],
    }).toString();
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
global.setupSessionMockAdapter = setupSessionMockAdapter;
global.mockApi = setupMockAdapter();
global.mockSessionApi = setupSessionMockAdapter();
global.setupStoreForMount = setupStoreForMount;

jest.spyOn(Date, 'now').mockImplementation(() => 1451606400000);

const MockDate = require('mockdate');
MockDate.set('6/30/2017');

global.mockDate = MockDate;
global.d = console.log;
