import React from 'react';
import Immutable from 'immutable';
import { rtlRender, WithReduxStore, WithRouter } from 'test-utils';

import * as Actions from 'actions/viewRecord';
import AdminContainer from './AdminContainer';
import { recordWithDatastreams } from 'mock/data';
import { useIsMobileView } from '../../../hooks';
import { useRecordContext, useTabbedContext } from 'context';
import { useParams } from 'react-router-dom';

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
// global.console.error = jest.fn();
// global.console.warn = jest.fn();
describe('AdminContainer component', () => {
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

    it('should render default view', () => {
        mockCookieSetter = jest.fn().mockImplementation(() => 'fullform');
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render loading record view', () => {
        const { container } = setup({
            state: {
                loadingRecordToView: true,
            },
        });
        expect(container).toMatchSnapshot();
    });
    it('should render record not found view', () => {
        const { container } = setup({
            state: {
                recordToView: null,
                loadingRecordToView: false,
                isDeleted: true,
                recordToViewError: { message: 'test', status: 404 },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render work not found if record is not loaded', () => {
        const { container } = setup({
            state: {
                loadingRecordToView: false,
                recordToView: null,
            },
        });
        expect(container).toMatchSnapshot();
    });
    it('should render when form errors are present', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        const actualHook = jest.requireActual('../validators');
        jest.spyOn(require('../validators'), 'useFormValidator').mockImplementation(() => ({
            ...actualHook,
            errors: {
                bibliographicSection: {
                    rek_date: 'Publication date is required',
                    rek_title: 'Title is required',
                },
            },
        }));

        const { container } = setup({});
        expect(container.querySelector('[role=tab][aria-selected=true] .MuiBadge-badge')).toHaveTextContent('2');
    });
    it('should render with an empty record', () => {
        useParams.mockImplementation(() => ({ pid: 'UQ:123456' }));
        const { container } = setup({
            state: {
                loadingRecordToView: false,
                recordToView: {
                    ...recordWithDatastreams,
                    rek_object_type_lookup: null,
                },
            },
        });
        expect(container.querySelector('[role=tab][aria-selected=true] .MuiBadge-badge')).toBeNull();
    });

    describe('React hooks', () => {
        it('should call clearRecordToView() prop on unload', () => {
            const clearFn = jest.spyOn(Actions, 'clearRecordToView');
            const { unmount } = setup();

            unmount();

            expect(clearFn).toHaveBeenCalled();
        });
    });
});
