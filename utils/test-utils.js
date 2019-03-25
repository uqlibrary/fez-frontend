import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-testing-library';
import {Router} from 'react-router-dom';
import {mui1theme} from 'config/theme';
import {Provider} from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import {store} from '../src/config/store';

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


const AllTheProviders = ({ children }) => {
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={mui1theme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    {children}
                </MuiPickersUtilsProvider>
            </MuiThemeProvider>
        </Provider>
    );
};

AllTheProviders.propTypes = {
    children: PropTypes.node
};

export const rtlRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export const renderWithRouter = (ui, {route = '/', history = createMemoryHistory({initialEntries: [route]})} = {}) => ({
    ...rtlRender(<Router history={history}>{ui}</Router>),
    history,
});

module.exports = {
    ...domTestingLib,
    ...reactTestingLib,
    queryByTestId,
    queryAllByTestId,
    getAllByTestId,
    getByTestId,
    rtlRender,
    renderWithRouter
};
