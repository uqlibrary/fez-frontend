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
const mime = require('mime-types');

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

export const defaultDatastream = {
    dsi_embargo_date: null,
    dsi_open_access: 1,
    dsi_label: '',
    dsi_copyright: null,
    dsi_state: 'A',
    dsi_size: 27932352,
};
export const createFezDatastreamInfoArray = (datastreams, pid = null, withPreview = true) => {
    let processed = datastreams.filter(datastream => typeof datastream === 'object' || typeof datastream === 'string');
    if (withPreview) {
        processed = [];
        datastreams.forEach(function(datastream) {
            processed.push(datastream);
            const filename = typeof datastream === 'object' ? datastream.dsi_dsid : datastream;
            const mimetype = mime.lookup(filename);
            // bail in case it's not derivable
            if (
                !filename.includes('.pdf') &&
                !mimetype.includes('image') &&
                !mimetype.includes('audio') &&
                !mimetype.includes('video')
            ) {
                return;
            }
            // eslint-disable-next-line no-nested-ternary
            const derivativeMimetype = mimetype.includes('audio')
                ? 'audio/mp3'
                : mimetype.includes('video')
                ? 'video/mp4'
                : 'image/jpg';

            (derivativeMimetype.includes('image') ? ['preview_', 'thumbnail_', 'web_'] : ['']).forEach(function(
                prefix,
            ) {
                processed.push({
                    dsi_dsid: `${prefix}${filename.split('.')[0]}_t.${derivativeMimetype.split('/').pop()}`,
                    dsi_mimetype: derivativeMimetype,
                });
            });
        });
    }

    return processed.map((datastream, index) => ({
        ...defaultDatastream,
        ...{
            dsi_pid: pid,
            dsi_order: index + 1,
            dsi_mimetype: mime.lookup(typeof datastream === 'object' ? datastream.dsi_dsid : datastream),
        },
        ...(typeof datastream === 'object'
            ? datastream
            : {
                  dsi_dsid: datastream,
              }),
    }));
};

export const withDatastreams = (sources, datastreams, callback) =>
    datastreams.map(item => {
        const source = sources.find(datastream =>
            datastream.dsi_dsid.includes(
                item.dsi_dsid
                    .replace('_t.', '.')
                    .replace('preview_', '')
                    .replace('thumbnail_', '')
                    .replace('web_', '')
                    .split('.')[0],
            ),
        );
        const isDerivative = item.dsi_dsid !== source.dsi_dsid;
        callback(item, source, isDerivative);
    });

export const getDatastreamByFilename = (filename, derivatives) =>
    derivatives.find(derivative => derivative.dsi_dsid === filename);

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
    createFezDatastreamInfoArray,
    getDatastreamByFilename,
    withDatastreams,
};
