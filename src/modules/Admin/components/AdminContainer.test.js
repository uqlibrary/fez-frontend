import React from 'react';
import Immutable from 'immutable';

import AdminContainer from './AdminContainer';
import { recordWithDatastreams } from 'mock/data';
import { useIsMobileView } from '../../../hooks';
import { rtlRender, WithReduxStore, WithRouter, preview } from 'test-utils';
import Cookies from 'js-cookie';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

jest.mock('../../../hooks/useIsMobileView');

jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));

jest.mock('js-cookie', () => jest.fn());

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
        },
        ...state,
    };
    /*
loadingRecordToView,
        authorDetails,
        recordToView: record,
        isDeleted,
        isJobCreated,
        recordToViewError,
        initialValues,
        locked,
        error,
*/
    return renderer(
        <WithReduxStore initialState={Immutable.Map(initState)}>
            <WithRouter>
                <AdminContainer {...props} />
            </WithRouter>
            ,
        </WithReduxStore>,
    );
}
/*
const { authorDetails, author } = useSelector(state => state.get('accountReducer'));
    const {
        recordToView: record,
        isRecordLocked,
        loadingRecordToView,
        isDeleted,
        isJobCreated,
        recordToViewError,
        error,
    } = useSelector(state => state.get('viewRecordReducer'));
*/
describe('AdminContainer component', () => {
    beforeEach(() => {
        Cookies.get = jest.fn().mockImplementation(() => 'tabbed');
        Cookies.set = jest.fn();
    });

    it('should render default view', () => {
        Cookies.get = jest.fn().mockImplementation(() => 'fullform');
        const { container } = setup({});
        preview.debug();
        expect(container).toMatchSnapshot();
    });
    it('should render mobile view', () => {
        Cookies.get = jest.fn().mockImplementation(() => 'fullform');
        useIsMobileView.mockImplementation(() => true);
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
    it('should render loading record view', () => {
        const { container } = setup({
            loadingRecordToView: true,
        });
        expect(container).toMatchSnapshot();
    });
    it('should render record not found view', () => {
        const { container } = setup({
            recordToView: null,
            loadingRecordToView: false,
            isDeleted: true,
            recordToViewError: { message: 'test', status: 404 },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render work not found if record is not loaded', () => {
        const { container } = setup({
            loadingRecordToView: false,
            recordToView: null,
        });
        expect(container).toMatchSnapshot();
    });
    it('should render when form errors are present as immutable map', () => {
        const { container } = setup({
            formErrors: Immutable.Map({
                bibliographicSection: {
                    rek_date: 'Publication date is required',
                    rek_title: 'Title is required',
                },
            }),
        });
        expect(container.querySelector('[role=tab][aria-selected=true] .MuiBadge-badge')).toHaveTextContent('2');
    });
    it('should render with an empty record', () => {
        const { container } = setup({
            loadingRecordToView: false,
            recordToView: {
                ...recordWithDatastreams,
                rek_object_type_lookup: null,
            },
            params: {
                pid: 'UQ:123456',
            },
        });
        expect(container.querySelector('[role=tab][aria-selected=true] .MuiBadge-badge')).toBeNull();
    });

    it('should not render non-security errors for community editing', () => {
        const { container } = setup({
            recordToView: {
                rek_pid: 'UQ:367646',
                rek_title: 'View across Windsor Castle',
                rek_description: 'Henry William Mobsby was born on 17 August 1860',
                rek_display_type: 11,
                rek_display_type_lookup: 'Community',
            },
            formErrors: Immutable.Map({
                bibliographicSection: {
                    rek_date: 'Publication date is required',
                    rek_title: 'Title is required',
                },
                securitySection: {
                    rek_security_policy: 'Policy is required',
                },
            }),
        });
        expect(container).toMatchSnapshot();
    });

    describe('React hooks', () => {
        it('should call clearRecordToView() prop on unload', () => {
            // need to override actions to check this is fired
            const clearRecordToView = jest.fn();
            const { unmount } = setup({
                clearRecordToView,
            });

            unmount();

            expect(clearRecordToView).toHaveBeenCalled();
        });
    });
});
