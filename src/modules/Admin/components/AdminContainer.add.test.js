import React from 'react';
import AdminContainer from './AdminContainer';
import { recordWithDatastreams } from 'mock/data';
import Immutable from 'immutable';
import { rtlRender, WithReduxStore, WithRouter } from 'test-utils';
import { reduxForm } from 'redux-form';
import Cookies from 'js-cookie';

jest.mock('../../../hooks/useIsMobileView');

jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));

jest.mock('js-cookie', () => jest.fn());

jest.mock('redux-form/immutable', () => ({
    ...jest.requireActual('redux-form/immutable'),
}));

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
        match: {
            params: {
                pid: 'UQ:111111',
            },
        },
        loadRecordToView: jest.fn(),
        loadingRecordToView: false,
        recordToView: recordWithDatastreams,
        location: {
            search: '',
        },
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

    it('should show Add form', () => {
        const { container } = setup({
            createMode: true,
            match: {
                params: {},
            },
        });
        expect(container).toMatchSnapshot();
    });
});
