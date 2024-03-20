import React from 'react';
import ThesisSubmission, { afterSubmit, cancelSubmit, getFormSubmitAlertProps } from './ThesisSubmission';
import { default as formLocale } from 'locale/publicationForm';
import * as config from 'config/general';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';
import Immutable from 'immutable';
import { useAccountContext } from 'context';

jest.mock('../../../context');

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disable}
                label={props.label || props.floatingLabelText}
            />
        );
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/', search: '' }),
}));

function setup(testProps, renderMethod = render) {
    const props = {
        dirty: testProps.dirty || false,
        isSessionValid: testProps.isSessionValid || true,
        actions: testProps.actions || {
            logout: jest.fn(),
            checkSession: jest.fn(),
            clearSessionExpiredFlag: jest.fn(),
        },
        fileAccessId: testProps.fileAccessId || 3, // PropTypes.number
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        invalid: testProps.invalid || false, // : PropTypes.bool
        isHdrThesis: testProps.isHdrThesis || false, // : PropTypes.bool
        submitSucceeded: testProps.submitSucceeded || false, // : PropTypes.bool
        submitting: testProps.submitting || false, // : PropTypes.bool
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <ThesisSubmission {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('ThesisSubmission', () => {
    let mockUseRef;

    beforeEach(() => {
        mockUseRef = jest.spyOn(React, 'useRef');
        mockUseRef.mockImplementation(() => ({ current: { showConfirmation: jest.fn() } }));

        useAccountContext.mockImplementation(() => ({
            account: {
                id: 's2222222',
            },
        }));
        config.THESIS_UPLOAD_RETRIES = 1;
    });

    it('should render sbs thesis submission form', () => {
        const { container, getByTestId } = setup({ isHdrThesis: false });

        // buttons
        expect(getByTestId('cancel-deposit-thesis')).toBeInTheDocument();
        expect(getByTestId('deposit-thesis')).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });

    it('should render sbs thesis submission acknowledgement', () => {
        const { container } = setup({ isHdrThesis: false, submitSucceeded: true });
        expect(container).toMatchSnapshot();
    });

    it('should render hdr thesis submission form', () => {
        const { container } = setup({ isHdrThesis: true });
        expect(container).toMatchSnapshot();
    });

    it('should render hdr thesis submission acknowledgement', () => {
        const { container } = setup({ isHdrThesis: true, submitSucceeded: true });
        expect(container).toMatchSnapshot();
    });

    it('should render component with buttons disabled on submitting', async () => {
        const { container, getByTestId } = setup({ isHdrThesis: true, submitting: true });
        expect(getByTestId('cancel-deposit-thesis')).toBeDisabled();
        expect(getByTestId('deposit-thesis')).toBeDisabled();
        expect(container).toMatchSnapshot();
    });

    it('should disable submit button if invalid form data before submit', () => {
        const { getByTestId } = setup({ disableSubmit: true });
        expect(getByTestId('deposit-thesis')).toBeDisabled();
    });

    it('should display successfull submission screen', () => {
        const { container } = setup({ submitSucceeded: true });
        expect(container).toMatchSnapshot();
    });

    it('should display confirmation box before submission', () => {
        const checkSessionMock = jest.fn();
        const { getByTestId, getByText } = setup({
            dirty: true,
            actions: { checkSession: checkSessionMock, clearSessionExpiredFlag: jest.fn() },
        });

        fireEvent.click(getByTestId('deposit-thesis'));
        expect(
            getByText(/You are about to deposit your thesis with attached files. Are you sure you want to proceed/i),
        ).toBeInTheDocument();
        expect(checkSessionMock).toBeCalled();
    });

    it('should show the file upload failure alert', () => {
        const { container } = setup({
            author: { aut_fname: 'First', aut_lname: 'Last', aut_org_student_id: '1234567' },
            newRecordFileUploadingOrIssueError: true,
            submitSucceeded: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should show file upload retry failure alert', () => {
        const retryUploadFn = jest.fn();
        const { getByRole, getByText, container } = setup({
            author: { aut_fname: 'First', aut_lname: 'Last', aut_org_student_id: '1234567' },
            newRecordFileUploadingOrIssueError: true,
            submitSucceeded: true,
            retryUpload: retryUploadFn,
        });
        fireEvent.click(getByRole('button', { name: 'Retry upload' }));

        expect(retryUploadFn).toBeCalled();
        expect(getByText(/FILE UPLOAD ERROR/i)).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should show file upload retry success alert', () => {
        const { getByRole, getByText, rerender } = setup({
            author: { aut_fname: 'First', aut_lname: 'Last', aut_org_student_id: '1234567' },
            newRecordFileUploadingOrIssueError: true,
            submitSucceeded: true,
            retryUpload: jest.fn(),
        });

        fireEvent.click(getByRole('button', { name: 'Retry upload' }));

        setup(
            {
                author: { aut_fname: 'First', aut_lname: 'Last', aut_org_student_id: '1234567' },
                newRecordFileUploadingOrIssueError: false,
                submitSucceeded: true,
            },
            rerender,
        );

        expect(getByText(/File upload retry succeeded/i)).toBeInTheDocument();
    });

    it('should have a helper to generate alert props', () => {
        expect(getFormSubmitAlertProps({ error: true })).toMatchSnapshot();
    });

    it('should show alert message not the thesis submission form to students not in the transition cohort', () => {
        useAccountContext.mockImplementation(() => ({
            account: { id: 's333333' },
        }));
        const { getByText } = setup({});
        expect(getByText(/HDR theses are now submitted via the UQ Research Data Manager/i)).toBeInTheDocument();
    });
});

describe('ThesisSubmission form - redirections', () => {
    const { location } = window;

    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };
    });

    afterEach(() => {
        window.location.assign.mockClear();
        window.location.reload.mockClear();
    });

    afterAll(() => {
        window.location = location;
    });

    it('should redirect to cancel page', () => {
        cancelSubmit();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(formLocale.thesisSubmission.cancelLink));
    });

    it('should redirect to after submit page', () => {
        afterSubmit();
        expect(window.location.assign).toBeCalledWith(
            expect.stringContaining(formLocale.thesisSubmission.afterSubmitLink),
        );
    });
});
