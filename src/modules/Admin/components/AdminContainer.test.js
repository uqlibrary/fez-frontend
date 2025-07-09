import React from 'react';
import AdminContainer, { isSame } from './AdminContainer';
import { recordWithDatastreams } from 'mock/data';
import Immutable from 'immutable';
import { useIsMobileView } from '../../../hooks/useIsMobileView';
import { rtlRender, WithReduxStore, WithRouter } from 'test-utils';
import { reduxForm } from 'redux-form';
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

jest.mock('redux-form/immutable');

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

const WithReduxForm = reduxForm({ form: 'AdminWorkForm' })(AdminContainer);

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        authorDetails: {
            username: 'uqstaff',
        },
        params: {
            pid: 'UQ:111111',
        },
        loadRecordToView: jest.fn(),
        loadingRecordToView: false,
        recordToView: recordWithDatastreams,
        handleSubmit: jest.fn(),
        clearRecordToView: jest.fn(),
        formValues: Immutable.Map({ rek_pid: 'UQ:252236', rek_subtype: 'Original Journal Article' }),
        ...testProps,
    };

    return renderer(
        <WithReduxStore>
            <WithRouter>
                <WithReduxForm {...props} />
            </WithRouter>
            ,
        </WithReduxStore>,
    );
}

describe('AdminContainer component', () => {
    beforeEach(() => {
        Cookies.get = jest.fn().mockImplementation(() => 'tabbed');
        Cookies.set = jest.fn();
    });
    it('should render default view', () => {
        Cookies.get = jest.fn().mockImplementation(() => 'fullform');
        const { container } = setup({});
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
    describe('isSame callback function', () => {
        it('should return true if props are not changed', () => {
            expect(
                isSame(
                    { disableSubmit: false, recordToView: { pid: 1 }, loadRecordToView: false },
                    { disableSubmit: false, recordToView: { pid: 1 }, loadRecordToView: false },
                ),
            ).toBeTruthy();
        });
        it('should return true if props are not changed', () => {
            expect(
                isSame(
                    { disableSubmit: false, loadRecordToView: false },
                    { disableSubmit: false, loadRecordToView: false },
                ),
            ).toBeTruthy();
        });
    });
    describe('React hooks', () => {
        it('should call clearRecordToView() prop on unload', () => {
            const clearRecordToView = jest.fn();
            const { unmount } = setup({
                clearRecordToView,
            });

            unmount();

            expect(clearRecordToView).toHaveBeenCalled();
        });
    });
});
