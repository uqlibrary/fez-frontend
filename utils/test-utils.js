/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Route } from 'react-router';
import { mui1theme } from 'config/theme';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { getStore } from '../src/config/store';
import Immutable from 'immutable';
import { createMemoryHistory } from 'history';

const domTestingLib = require('@testing-library/dom');
const reactTestingLib = require('@testing-library/react');

const { configure } = domTestingLib;

configure(config => ({
    ...config,
    testIdAttribute: 'id',
}));

export const AllTheProviders = props => {
    return (
        <MuiThemeProvider theme={mui1theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>{props.children}</MuiPickersUtilsProvider>
        </MuiThemeProvider>
    );
};

AllTheProviders.propTypes = {
    children: PropTypes.node,
};

export const rtlRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

export const renderWithRouter = (
    ui,
    { route = '/', history = createMemoryHistory({ initialEntries: [route] }), renderMethod = render } = {},
) => {
    return renderMethod(
        <AllTheProviders>
            <Router history={history}>{ui}</Router>
        </AllTheProviders>,
    );
};

export const WithRouter = ({ children, route = '/', history = createMemoryHistory({ initialEntries: [route] }) }) => (
    <AllTheProviders>
        <Router history={history}>{children}</Router>
    </AllTheProviders>
);
export const renderWithRedux = ({ initialState }) => render => {
    return {
        ...render,
        store: getStore({ initialState, history: render.history }),
    };
};

export const withRouter = ({
    route = '/',
    path = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
} = {}) => WrappedComponent => {
    return (
        <Router history={history}>
            <Route path={path} children={WrappedComponent} />
        </Router>
    );
};

export const withRedux = (initialState = Immutable.Map()) => WrappedComponent => {
    return <Provider store={getStore(initialState)}>{WrappedComponent}</Provider>;
};

export const WithReduxStore = ({ initialState = Immutable.Map(), children }) => (
    <Provider store={getStore(initialState)}>
        <AllTheProviders>{children}</AllTheProviders>
    </Provider>
);

module.exports = {
    ...domTestingLib,
    ...reactTestingLib,
    rtlRender,
    renderWithRouter,
    renderWithRedux,
    withRedux,
    withRouter,
    AllTheProviders,
    WithReduxStore,
    WithRouter,
};
