/* eslint-env jest */
import React from 'react';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { mui1theme } from 'config';
import { api, sessionApi } from 'config/axios';
import { StyledEngineProvider } from '@mui/material/styles';
import ThemeProvider from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import prettyFormat from 'pretty-format';
import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

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

// render component with React Test Renderer
global.renderComponent = (component, props, args = {}) => {
    const { isShallow, requiresStore, context, store, renderer } = {
        isShallow: true,
        requiresStore: false,
        context: {},
        store: setupStoreForMount().store,
        renderer: TestRenderer,
        ...args,
    };

    if (isShallow) {
        const render = new ShallowRenderer();
        if (requiresStore) {
            render.render(<Provider store={store}>{React.createElement(component, props)}</Provider>, {
                context,
            });
        } else {
            render.render(React.createElement(component, props), { context });
        }
        return render;
    }

    return renderer.create(
        <Provider store={store}>
            <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={mui1theme}>
                        <LocalizationProvider dateAdapter={MomentUtils}>
                            {React.createElement(component, props)}
                        </LocalizationProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </MemoryRouter>
        </Provider>,
    );
};

global.componentToString = component => {
    return prettyFormat(TestRenderer.create(component), {
        plugins: [prettyFormat.plugins.ReactTestComponent],
    }).toString();
};

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

// jsdom v20 is unable to parse CKEditor 5 v41 css files
// suppressing the CSS parsing error messages as they dont really break the tests
const originalConsoleError = console.error;
const jsDomCssError = 'Error: Could not parse CSS stylesheet';
console.error = (...params) => {
    if (!params.find(p => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};
