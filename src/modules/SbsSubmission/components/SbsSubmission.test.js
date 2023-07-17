import SbsSubmission from './SbsSubmission';
import Immutable from 'immutable';
import { default as formLocale } from 'locale/publicationForm';
import React from 'react';
import { fireEvent, render, WithReduxStore, WithRouter } from 'test-utils';

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

function setup(testProps = {}) {
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

    return render(
        <WithReduxStore>
            <WithRouter>
                <SbsSubmission {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('SbsSubmission test', () => {
    it('should render sbs thesis submission form', () => {
        const { container, getByTestId } = setup({ isHdrThesis: false });
        // buttons
        expect(getByTestId('cancel-submit-thesis')).toBeInTheDocument();
        expect(getByTestId('submit-thesis')).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });

    it('should render sbs thesis submission acknowledgement', () => {
        const { container } = setup({ isHdrThesis: false, submitSucceeded: true });
        expect(container).toMatchSnapshot();
    });

    it('should render component with all buttons disabled', () => {
        const { container, getByTestId } = setup({ submitting: true });
        expect(getByTestId('cancel-submit-thesis')).toBeDisabled();
        expect(getByTestId('submit-thesis')).toBeDisabled();
        expect(container).toMatchSnapshot();
    });

    it('should disable submit button if invalid form data before submit', () => {
        const { getByTestId } = setup({ disableSubmit: true });
        expect(getByTestId('submit-thesis')).toBeDisabled();
    });

    it('should not disable submit button if form submit has failed', () => {
        const { getByTestId } = setup({ error: true });
        expect(getByTestId('submit-thesis')).toBeEnabled();
    });

    it('should display successfull submission screen', () => {
        const { container } = setup({ submitSucceeded: true });
        expect(container).toMatchSnapshot();
    });

    it('should have a helper to generate alert props', () => {
        const { getByText } = setup({ error: true });
        expect(getByText(/Error has occurred during request and request cannot be processed/i)).toBeInTheDocument();
    });

    it('should render sbs thesis submission form', () => {
        const { container } = setup({ newRecordFileUploadingOrIssueError: true, submitSucceeded: true });
        expect(container).toMatchSnapshot();
    });

    it('should ask when redirecting from form with data (even if submit failed)', () => {
        const { container } = setup({ dirty: true, submitSucceeded: false });
        expect(container).toBeInTheDocument();
    });

    it('should not ask when redirecting from form with data after successful submit', () => {
        const { getByText } = setup({ dirty: true, submitSucceeded: true });
        expect(getByText(/Your thesis has been deposited/i)).toBeInTheDocument();
    });

    it('should display confirmation box before submission', () => {
        const checkSessionMock = jest.fn();
        const { getByTestId } = setup({
            dirty: true,
            actions: { checkSession: checkSessionMock, clearSessionExpiredFlag: jest.fn() },
        });

        fireEvent.click(getByTestId('submit-thesis'));

        expect(checkSessionMock).toBeCalled();
    });

    it('should reload on cancel', () => {
        const { location } = window;
        const reloadFn = jest.fn();
        delete window.location;
        global.window.location = { reload: reloadFn };
        // window.location = { assign: jest.fn() };
        const { getByTestId } = setup({ dirty: true });

        fireEvent.click(getByTestId('cancel-submit-thesis'));

        expect(reloadFn).toBeCalled();
        window.location = location;
    });

    /*
    it('should redirect to after submit page', () => {
        const { location } = window;
        delete window.location;
        window.location = { assign: jest.fn() };
        const { getByTestId } = setup({ dirty: true });
        fireEvent.click(getByTestId('submit-thesis'));
        expect(window.location.assign).toBeCalledWith(
            expect.stringContaining(formLocale.thesisSubmission.afterSubmitLink),
        );
        window.location = location;
    });

    it('should reload when told to', () => {
        delete global.window.location;
        const reloadFn = jest.fn();
        global.window.location = { reload: reloadFn };
        const { conatiner } = setup({ submitFailed: true });
        expect(reloadFn).toBeCalled();
    });*/
});
