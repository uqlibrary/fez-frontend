import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import Immutable from 'immutable';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('modules/SharedComponents/Toolbox/ReactHookForm', () => ({
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disabled}
                label={props.label || props.floatingLabelText}
                hasError={props.hasError}
            />
        );
    },
}));

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        handleSubmit: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        dirty: true,
        form: 'form',
        initialized: false,
        submitFailed: false,
        valid: true,
        pure: true,
        submitAsSideEffect: false,
        // common immutable props above
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        submitting: testProps.submitting || false, // : PropTypes.bool
        submitSucceeded: testProps.submitSucceeded || false, // : PropTypes.bool
        invalid: testProps.invalid || false, // : PropTypes.bool
        pristine: testProps.pristine || false, // : PropTypes.bool
        fileAccessId: testProps.fileAccessId || 3, // PropTypes.number
        actions: {
            logout: jest.fn(),
        },
        resetForm: testProps.resetForm || jest.fn(),
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <AddDataCollection {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('AddDataCollection test', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
    });

    it('should render data set form', () => {
        const { container, getByRole } = setup();

        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(28);
        expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Submit for approval' })).toBeInTheDocument();
    });

    it('should render component with all fields disabled', () => {
        const { container } = setup({ submitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(28);
    });

    it('should disable submit button if invalid form data before submit', () => {
        const { getByRole } = setup({ disableSubmit: true });
        expect(getByRole('button', { name: 'Submit for approval' })).toBeDisabled();
    });

    it('should not disable submit button if form submit has failed', () => {
        const { getByRole } = setup({ submitFailed: true });
        expect(getByRole('button', { name: 'Submit for approval' })).not.toBeDisabled();
    });

    it('should redirect to cancel page', async () => {
        const { location } = window;
        delete window.location;
        window.location = { reload: jest.fn() };
        const { getByRole } = setup();

        fireEvent.click(getByRole('button', { name: 'Cancel' }));
        expect(window.location.reload).toHaveBeenCalled();
        window.location = location;
    });

    it('should navigate to my datasets url', async () => {
        const clearNewRecordFn = jest.fn();
        const { rerender } = setup({
            submitSucceeded: false,
        });

        setup(
            {
                submitSucceeded: true,
                actions: {
                    clearNewRecord: clearNewRecordFn,
                },
            },
            rerender,
        );
        await waitFor(() => expect(screen.getByTestId('confirm-dialog-box')));

        fireEvent.click(screen.getByTestId('confirm-dialog-box'));

        expect(clearNewRecordFn).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith('/data-collections/mine');
    });

    it('should get save confirmation locale correctly', () => {
        const { container, rerender } = setup();
        setup({ newRecordFileUploadingOrIssueError: true, submitSucceeded: true }, rerender);
        expect(container).toMatchSnapshot();
    });

    it('should render component with an invalid collection date range', () => {
        const { container } = setup({
            initialValues: {
                fez_record_search_key_start_date: {
                    rek_start_date: '2018-06-30',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2018-04-30', // before the start date - invalid!
                },
            },
        });
        // hasError Date range is not valid
        expect(container).toMatchSnapshot();
    });

    it('should render component with a valid collection date range', () => {
        const { container } = setup({
            initialValues: {
                fez_record_search_key_start_date: {
                    rek_start_date: '2018-06-30',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2018-07-30',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should not generate an error when licence locale is missing', () => {
        // licence text not supplied
        expect(licenseText()).toMatchSnapshot();

        // licence text lacks required internal structure
        expect(licenseText(['something'])).toMatchSnapshot();
    });
});
