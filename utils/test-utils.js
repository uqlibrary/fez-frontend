/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { mui1theme } from 'config/theme';
import { Provider } from 'react-redux';
import { FormProvider } from 'react-hook-form';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { getStore, storeInstance } from '../src/config/store';

import mediaQuery from 'css-mediaquery';

const domTestingLib = require('@testing-library/dom');
const reactTestingLib = require('@testing-library/react');
const mime = require('mime-types');

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import preview, { jestPreviewConfigure } from 'jest-preview';
import * as useValidatedForm from 'hooks/useValidatedForm';
import * as useForm from 'hooks/useForm';
import { apiRequestHistory } from '../src/config/axios';
import { api } from './api-mock';
import { isEmptyObject } from '../src/helpers/general';
import { locale } from 'locale';

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

export const getReduxStoreState = namespace =>
    namespace ? storeInstance.getState().toJS()[namespace] : storeInstance.getState().toJS();

export const WithRedux = ({ initialState, children }) => <Provider store={getStore(initialState)}>{children}</Provider>;

export const WithReduxStore = ({ initialState = {}, children }) => (
    <WithRedux initialState={initialState}>
        <AllTheProviders>{children}</AllTheProviders>
    </WithRedux>
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
const addFilesToFileUploader = files => {
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

const expectRequiredFieldError = async field =>
    await waitFor(() => {
        expect(screen.getByTestId(`${field}-helper-text`)).toBeInTheDocument();
        expect(screen.getByTestId(`${field}-helper-text`)).toHaveTextContent(locale.validationErrors.required);
    });

const expectMissingRequiredFieldError = async field =>
    screen.queryByTestId(`${field}-helper-text`) &&
    (await waitFor(() => {
        expect(screen.queryByTestId(`${field}-helper-text`)).not.toBeInTheDocument();
    }));

const setFileUploaderFilesToClosedAccess = async files => {
    const { fireEvent } = reactTestingLib;
    // set all files to closed access
    for (const file of files) {
        const index = files.indexOf(file);
        await waitForText(new RegExp(getFilenameBasename(file)));
        fireEvent.mouseDown(screen.getByTestId(`dsi-open-access-${index}-select`));
        fireEvent.click(screen.getByRole('option', { name: 'Closed Access' }));
    }
};

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

// eslint-disable-next-line react/prop-types
export const FormProviderWrapper = ({ children, methods, ...props }) => {
    const attributes = useValidatedForm.useValidatedForm(props);
    return (
        <FormProvider {...attributes} {...methods}>
            {children}
        </FormProvider>
    );
};

/**
 *
 * @param {object|function?} expected
 * @param {object} request
 */
const assertRequestData = (expected, request) => {
    const actual = !isEmptyObject(request.data || {}) ? request.data : request.params;
    if (typeof expected === 'object') {
        expect(JSON.parse(actual)).toStrictEqual(expected);
    } else if (typeof expected === 'function') {
        expect(expected(actual)).toBeTruthy();
    }
};

const requestHistoryToString = history =>
    JSON.stringify(
        history.reduce((acc, item) => {
            acc.push({ method: item.method, url: item.url, data: item.data, params: item.params });
            return acc;
        }, []),
        null,
        2,
    );

const debugApiRequestHistory = () => console.log(requestHistoryToString(apiRequestHistory));

const requestFilter = ({ method, url, partialUrl }) => entry =>
    (!method || entry.method === method) &&
    (!url || entry.url === url) &&
    (!partialUrl || entry.url.includes(partialUrl));

const findRequestHistoryIndex = ({ history, method, url, partialUrl }) =>
    history.findIndex(requestFilter({ method, url, partialUrl }));
const assertRequestCount = ({ history, method, url, partialUrl }, expectation) =>
    expect(history.filter(requestFilter({ method, url, partialUrl }))).toHaveLength(expectation);

/**
 * @param {string} method
 * @param {string} url
 * @param {string} partialUrl
 * @param {function|object} data
 * @param {object} request
 */
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

const expectApiRequestCountToBe = (method, url, expectation) =>
    assertRequestCount({ history: apiRequestHistory, method, url }, expectation);

/**
 * @param {number} count
 */
const expectApiRequestHistoryLengthToBe = (count = 0) => expect(apiRequestHistory).toHaveLength(count);
const expectApiRequestHistoryToBeEmpty = () => expectApiRequestHistoryLengthToBe(0);

/**
 * Note: this method will pop matched request from history
 * @param {string} method
 * @param {string} url
 * @param {string} partialUrl
 * @param {?function|object} data
 * @return {*}
 */
const assertApiRequest = ({ method, url, partialUrl, data }) => {
    if (!method && !url && !partialUrl && isEmptyObject(data || {})) throw new Error('invalid params');

    // try to find the last request based on method, url and partialUrl if these are available
    const index = findRequestHistoryIndex({ history: apiRequestHistory, method, url, partialUrl });
    if (index < 0) {
        throw new Error(
            `No ${(method || 'N/A').toUpperCase()} request has been made to ${url ||
                partialUrl ||
                'N/A'}\n\nRequest queue:\n${requestHistoryToString(apiRequestHistory)}`,
        );
    }
    // pop match from queue, so that similar requests can be processed by consecutive calls
    const [request] = apiRequestHistory.splice(index, 1);
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
 * @return {*}
 */
const expectApiRequestToMatchSnapshot = (method, url, assertPayload) => {
    const request = assertApiRequest({
        method,
        url,
        partialUrl: url,
        data: data => expect(data).toMatchSnapshot() || true,
    });
    return typeof assertPayload === 'function' ? assertRequestData(assertPayload, request) : request;
};

const previewAndHalt = () => {
    preview.debug();
    process.exit(0);
};

/**
 * @param {string} containerTestId
 * @param {string} value
 */
const setRichTextEditorValue = async (containerTestId, value) => {
    const editor = screen.getByTestId(containerTestId).querySelector('.ck-editor__editable').ckeditorInstance;
    editor.model.change(writer => {
        writer.insertText(value, editor.model.document.selection.getFirstPosition());
    });
    await userEvent.tab();
};

/**
 * @param {string} id
 * @param {string} option
 * @param {number}  index
 * @return {Promise<void>}
 */
const selectDropDownOption = async (id, option, index = 0) => {
    await userEvent.click(screen.getByTestId(id));
    await userEvent.click(screen.queryAllByRole('option', { name: option })[index]);
};

/**
 * @param {string} fieldName
 * @param {string} name
 * @return {Promise<void>}
 */
const addContributorsEditorItem = async (fieldName, name = 'author') => {
    await userEvent.type(screen.getByTestId(`${fieldName}-input`), name);
    await userEvent.click(screen.getByTestId(`${fieldName}-add`));
};

/**
 * @param {string} fieldName
 * @param {string} name
 * @return {Promise<void>}
 */
const addAndSelectContributorsEditorItem = async (fieldName, name = 'author') => {
    await addContributorsEditorItem(fieldName, name);
    await userEvent.click(screen.getByTestId(`${fieldName}-list-row-0-name-as-published`));
};

const clearAndType = async (input, value) => {
    await userEvent.clear(screen.getByTestId(input));
    await userEvent.type(screen.getByTestId(input), value);
};

module.exports = {
    ...domTestingLib,
    ...reactTestingLib,
    rtlRender,
    WithRedux,
    getReduxStoreState,
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
    expectRequiredFieldError,
    expectMissingRequiredFieldError,
    mockUseForm,
    getFilenameExtension,
    getFilenameBasename,
    addFilesToFileUploader,
    setFileUploaderFilesToClosedAccess,
    FormProviderWrapper,
    turnOnJestPreviewOnTestFailure,
    mockWebApiFile,
    assertRequestData,
    assertRequest,
    debugApiRequestHistory,
    expectApiRequestCountToBe,
    expectApiRequestHistoryLengthToBe,
    expectApiRequestHistoryToBeEmpty,
    assertApiRequest,
    expectApiRequestToMatchSnapshot,
    assertInstanceOfFile,
    previewAndHalt,
    setRichTextEditorValue,
    selectDropDownOption,
    addContributorsEditorItem,
    addAndSelectContributorsEditorItem,
    clearAndType,
    api,
};
