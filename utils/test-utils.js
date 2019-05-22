import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-testing-library';
import {Router} from 'react-router-dom';
import {Route} from 'react-router';
import {mui1theme} from 'config/theme';
import {Provider} from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import {getStore} from '../src/config/store';
import Immutable from 'immutable';
import {createMemoryHistory} from 'history';

const domTestingLib = require('dom-testing-library');
const reactTestingLib = require('react-testing-library');

const { configure } = domTestingLib;

configure((config) => ({
    ...config,
    testIdAttribute: 'id'
}));

const AllTheProviders = (props) => {
    return (
        <MuiThemeProvider theme={mui1theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                {props.children}
            </MuiPickersUtilsProvider>
        </MuiThemeProvider>
    );
};

AllTheProviders.propTypes = {
    children: PropTypes.node
};

export const rtlRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export const renderWithRouter = (ui, {
    route = '/',
    history = createMemoryHistory({initialEntries: [route]})
} = {}) => {
    return {
        ...rtlRender(<Router history={history}>{ui}</Router>),
        history,
    };
};

export const renderWithRedux = ({initialState}) => (render) => {
    return {
        ...render,
        store: getStore({initialState, history: render.history})
    };
};

export const withRouter = ({
    route = '/',
    path = '/',
    history = createMemoryHistory({initialEntries: [route]})} = {}
) => (WrappedComponent) => {
    return (<Router history={history}>
        <Route path={path} children={WrappedComponent} /></Router>);
};

export const withRedux = (initialState = Immutable.Map()) => (WrappedComponent) => {
    return (<Provider store={getStore(initialState)}>{WrappedComponent}</Provider>);
};

module.exports = {
    ...domTestingLib,
    ...reactTestingLib,
    rtlRender,
    renderWithRouter,
    renderWithRedux,
    withRedux,
    withRouter
};
