import React from 'react';
import { rtlRender, WithReduxStore, WithRouter } from 'test-utils';

import AdminContainer from './AdminContainer';
import { recordWithDatastreams } from 'mock/data';
import { useIsMobileView } from '../../../hooks';
import { useRecordContext, useTabbedContext } from 'context';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

jest.mock('../../../hooks', () => ({
    ...jest.requireActual('../../../hooks'),
    useIsMobileView: jest.fn(() => false),
}));

jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));

const cookieSetterOriginal = jest.fn().mockImplementation(() => 'tabbed');
let mockCookieSetter = cookieSetterOriginal;

jest.mock('../../../context');
jest.mock('js-cookie', () => ({
    get: jest.fn().mockImplementation(() => mockCookieSetter),
    set: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ pid: 'UQ:111111' })),
}));

function setup({ state, ...testProps } = {}, renderer = rtlRender) {
    const props = {
        createMode: false,
        ...testProps,
    };

    const initState = {
        accountReducer: { authorDetails: { username: 'uqstaff' } },
        viewRecordReducer: {
            recordToView: recordWithDatastreams,
            loadingRecordToView: false,
            recordToViewError: null,
            isRecordLocked: false,
            isDeleted: false,
            isDeletedVersion: false,
            isJobCreated: false,
            error: null,
            ...state,
        },
    };

    return renderer(
        <WithReduxStore initialState={initState}>
            <WithRouter>
                <AdminContainer {...props} />
            </WithRouter>
            ,
        </WithReduxStore>,
    );
}
global.console.error = jest.fn();
global.console.warn = jest.fn();
describe('Mobile AdminContainer component', () => {
    beforeEach(() => {
        mockCookieSetter = cookieSetterOriginal;

        useRecordContext.mockImplementation(() => ({
            record: recordWithDatastreams,
        }));
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useIsMobileView.mockImplementation(() => false);
    });
    afterEach(() => {
        useRecordContext.mockReset();
        useTabbedContext.mockReset();
        useIsMobileView.mockReset();
    });

    it('should render mobile view', () => {
        mockCookieSetter = jest.fn().mockImplementation(() => 'fullform');
        useIsMobileView.mockImplementation(() => true);

        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
