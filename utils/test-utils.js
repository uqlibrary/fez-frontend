import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-testing-library';
import {Router} from 'react-router-dom';
import {mui1theme} from 'config/theme';
import {Provider} from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';

import {getStore} from '../src/config/store';
import Immutable from 'immutable';
import {createMemoryHistory} from 'history';

const domTestingLib = require('dom-testing-library');
const reactTestingLib = require('react-testing-library');

const { queryHelpers } = domTestingLib;

const queryByTestId = queryHelpers.queryByAttribute.bind(
    null,
    'id'
);

const queryAllByTestId = queryHelpers.queryAllByAttribute.bind(
    null,
    'id'
);

function getAllByTestId(container, id, ...rest) {
    const els = queryAllByTestId(container, id, ...rest);
    if (!els.length) {
        throw queryHelpers.getElementError(
            `Unable to find an element by: [id="${id}"]`,
            container
        );
    }
    return els;
}

function getByTestId(...args) {
    return queryHelpers.firstResultOrNull(getAllByTestId, ...args);
}


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
    history = createMemoryHistory({initialEntries: [route]})} = {}
) => (WrappedComponent) => {
    return (<Router history={history}>{WrappedComponent}</Router>);
};

export const withRedux = (initialState = Immutable.Map()) => (WrappedComponent) => {
    return (<Provider store={getStore(initialState)}>{WrappedComponent}</Provider>);
};

module.exports = {
    ...domTestingLib,
    ...reactTestingLib,
    queryByTestId,
    queryAllByTestId,
    getAllByTestId,
    getByTestId,
    rtlRender,
    renderWithRouter,
    renderWithRedux,
    withRedux,
    withRouter
};
