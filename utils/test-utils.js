/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { mui1theme } from 'config/theme';
import { Provider } from 'react-redux';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { getStore } from '../src/config/store';
import Immutable from 'immutable';

import mediaQuery from 'css-mediaquery';

const domTestingLib = require('@testing-library/dom');
const reactTestingLib = require('@testing-library/react');
const mime = require('mime-types');

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import preview, { jestPreviewConfigure } from 'jest-preview';
import * as useForm from 'hooks/useForm';
import { lastRequests } from '../src/config/axios';
import { api } from './api-mock';

import { isPlainObject } from 'lodash';

export const AllTheProviders = props => {
    return (
        <MuiThemeProvider theme={mui1theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>{props.children}</LocalizationProvider>
        </MuiThemeProvider>
    );
};

AllTheProviders.propTypes = {
    children: PropTypes.node,
};

export const rtlRender = (ui, options) => {
    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: AllTheProviders, ...options }),
    };
};

export const WithRouter = ({ children, route = '/', initialEntries = [route] }) => {
    const routes = [{ path: route, element: children }];
    const router = createMemoryRouter(routes, { initialEntries: initialEntries });
    return <RouterProvider router={router} />;
};

export const withRedux = (initialState = Immutable.Map()) => WrappedComponent => {
    return <Provider store={getStore(initialState)}>{WrappedComponent}</Provider>;
};

export const WithReduxStore = ({ initialState = Immutable.Map(), children }) => (
    <Provider store={getStore(initialState)}>
        <AllTheProviders>{children}</AllTheProviders>
    </Provider>
);

export const assertTooltipText = async (trigger, tooltipText) => {
    expect(trigger).toBeInTheDocument();
    await userEvent.hover(trigger);
    await waitFor(() => {
        expect(screen.getByRole('tooltip', { name: tooltipText, hidden: true })).toBeVisible();
    });
};

const extensionToMimeMap = {
    tiff: 'image/tiff',
    wav: 'audio/wave',
    zip: 'application/zip',
};
const mimeType = filename => extensionToMimeMap[filename.split('.').pop()];

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
        datastreams.forEach(datastream => {
            processed.push(datastream);
            const filename = typeof datastream === 'object' ? datastream.dsi_dsid : datastream;
            const mimetype = mimeType(filename);
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

            (derivativeMimetype.includes('image') ? ['preview_', 'thumbnail_', 'web_'] : ['']).forEach(prefix => {
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
            dsi_id: index + 1,
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

export const getDatastreamByFilename = (filename, datastreams) =>
    datastreams.find(datastream => datastream.dsi_dsid === filename);

export const createMatchMedia = width => {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        /* istanbul ignore next */
        addListener: () => {},
        /* istanbul ignore next */
        removeListener: () => {},
    });
};

const getFilenameExtension = filename => filename.split('.').pop();
const getFilenameBasename = filename => filename.replace(new RegExp(`/\.${getFilenameExtension(filename)}$/`), '');
const addFilesToFileUploader = async (files, timeout = 500) => {
    const { screen, fireEvent } = reactTestingLib;
    // create a list of Files
    const fileList = files.map(file => {
        // if file it's a string, treat it as a filename
        if (typeof file === 'string') {
            return new File([getFilenameBasename(file)], file, { type: `image/${getFilenameExtension(file)}` });
        }
        // otherwise expect it to be a object with filename and mimeType keys
        return new File([getFilenameBasename(file.filename)], file.filename, { type: file.mimeType });
    });
    // drag and drop files
    fireEvent.drop(screen.getByTestId('fez-datastream-info-input'), {
        dataTransfer: {
            files: fileList,
            types: ['Files'],
        },
    });
    for (const file of files) {
        await waitFor(() => screen.getByText(new RegExp(getFilenameBasename(file))), { timeout });
    }
};
const setFileUploaderFilesToClosedAccess = async (files, timeout = 500) => {
    const { fireEvent } = reactTestingLib;
    // set all files to closed access
    for (const file of files) {
        const index = files.indexOf(file);
        await waitFor(() => screen.getByText(new RegExp(getFilenameBasename(file))), { timeout });
        fireEvent.mouseDown(screen.getByTestId(`dsi-open-access-${index}-select`));
        fireEvent.click(screen.getByRole('option', { name: 'Closed Access' }));
    }
};
const setFileUploaderFilesSecurityPolicy = async (files, optionName, timeout = 500) => {
    const { fireEvent, within } = reactTestingLib;
    // set all files to closed access
    for (const file of files) {
        const index = files.indexOf(file);
        await waitFor(() => screen.getByText(new RegExp(getFilenameBasename(file))), { timeout });
        fireEvent.mouseDown(
            within(screen.getByTestId('files-section-content')).getByTestId(`dsi-security-policy-${index}-select`),
        );
        fireEvent.click(screen.getByRole('option', { name: optionName }));
    }
};

const assertEnabled = element =>
    expect(typeof element === 'string' ? screen.getByTestId(element) : element).not.toHaveAttribute('disabled');
const assertDisabled = element =>
    expect(typeof element === 'string' ? screen.getByTestId(element) : element).toHaveAttribute('disabled');
const waitToBeEnabled = async element =>
    await waitFor(() =>
        expect(typeof element === 'string' ? screen.getByTestId(element) : element).not.toHaveAttribute('disabled'),
    );
const waitToBeDisabled = async element =>
    await waitFor(() =>
        expect(typeof element === 'string' ? screen.getByTestId(element) : element).toHaveAttribute('disabled'),
    );
const waitForText = async (text, options) =>
    ((typeof text === 'string' && !!text.trim().length) || text) &&
    !screen.queryByText(text) &&
    (await waitFor(() => screen.getByText(text), options));
const waitForTextToBeRemoved = async (text, options) =>
    ((typeof text === 'string' && !!text.trim().length) || text) &&
    screen.queryByText(text) &&
    (await waitForElementToBeRemoved(() => screen.queryByText(text)), options);

const originalUseForm = useForm.useForm;
const mockUseForm = implementation => {
    return jest.spyOn(useForm, 'useForm').mockImplementation(props => {
        return implementation(props, originalUseForm);
    });
};

const turnOnJestPreviewOnTestFailure = (options = {}) =>
    jestPreviewConfigure({
        autoPreview: true,
        ...options,
    });

const mockWebApiFile = () => {
    global.File = class File extends Blob {
        name;
        constructor(parts, name) {
            super(parts);
            this.name = name;
        }
    };
};

const assertRequestData = (data, request) => {
    if (typeof data === 'object') {
        expect(JSON.parse(request.data)).toStrictEqual(data);
    } else if (typeof data === 'function') {
        expect(data(request.data)).toBeTruthy();
    }
};

const assertRequest = ({ method, url, partialUrl, data, request }) => {
    if (method && method !== '*') {
        expect(request.method).toBe(method);
    }

    if (url) {
        expect(request.url).toBe(url);
    } else if (partialUrl) {
        expect(request.url.includes(partialUrl)).toBeTruthy();
    }

    assertRequestData(data, request);
};

const assertApiRequest = ({ method, url, partialUrl, data }) => {
    // try to find the last request based on method, url and partialUrl if these are available
    const index = lastRequests.findIndex(
        entry =>
            (!method || entry.method === method) &&
            (!url || entry.url === url) &&
            (!partialUrl || entry.url.includes(partialUrl)),
    );

    if (index < 0) {
        throw new Error(
            `No ${(method || 'N/A').toUpperCase()} request has been made to ${url ||
                partialUrl ||
                'N/A'}\n\nRequest queue:\n${JSON.stringify(
                lastRequests.reduce((acc, item) => {
                    acc.push({ method: item.method, url: item.url });
                    return acc;
                }, []),
                null,
                2,
            )}`,
        );
    }
    // pop match from queue, so that similar requests can be processed by consecutive calls
    const [request] = lastRequests.splice(index, 1);
    assertRequest({ method, url, partialUrl, data, request });

    return request;
};

const assertInstanceOfFile = data => {
    expect(data).toBeInstanceOf(File);
    return true;
};

/**
 * Note: this method will pop matched request from history
 * @param {string} method
 * @param {string} url
 * @param {function?} assertPayload
 * @param {function?} transformer
 * @return {*}
 */
const expectApiRequestToMatchSnapshot = (method, url, assertPayload, transformer) => {
    const request = assertApiRequest({
        method,
        url,
        partialUrl: url,
        data: data => expect(transformer?.(data) ?? data).toMatchSnapshot() || true,
    });
    return typeof assertPayload === 'function' ? assertRequestData(assertPayload, request) : request;
};

const previewAndHalt = () => {
    preview.debug();
    process.exit(0);
};

// https://stackoverflow.com/a/73160202/1417494
const sortObjectProps = obj => {
    return Object.keys(obj)
        .sort()
        .reduce((ordered, key) => {
            let value = obj[key];

            if (isPlainObject(value)) {
                ordered[key] = sortObjectProps(value);
            } else {
                if (Array.isArray(value)) {
                    value = value.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        if (isPlainObject(v)) v = sortObjectProps(v);
                        return v;
                    });
                }
                ordered[key] = value;
            }
            return ordered;
        }, {});
};

module.exports = {
    ...domTestingLib,
    ...reactTestingLib,
    rtlRender,
    withRedux,
    AllTheProviders,
    WithReduxStore,
    assertTooltipText,
    WithRouter,
    createFezDatastreamInfoArray,
    getDatastreamByFilename,
    withDatastreams,
    createMatchMedia,
    preview,
    userEvent,
    assertEnabled,
    assertDisabled,
    waitToBeEnabled,
    waitToBeDisabled,
    waitForText,
    waitForTextToBeRemoved,
    mockUseForm,
    getFilenameExtension,
    getFilenameBasename,
    addFilesToFileUploader,
    setFileUploaderFilesToClosedAccess,
    setFileUploaderFilesSecurityPolicy,
    turnOnJestPreviewOnTestFailure,
    mockWebApiFile,
    assertRequestData,
    assertRequest,
    assertApiRequest,
    expectApiRequestToMatchSnapshot,
    assertInstanceOfFile,
    previewAndHalt,
    sortObjectProps,
    api,
};
