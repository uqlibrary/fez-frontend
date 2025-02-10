import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen, preview } from 'test-utils';
import { useValidatedForm } from 'hooks';

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

jest.mock('hooks', () => ({
    useValidatedForm: jest.fn(),
}));

describe('AddDataCollection test mocking hooks', () => {
    beforeEach(() => {
        // jest.resetModules(); // Reset modules to ensure fresh imports
    });

    afterEach(() => {
        // jest.clearAllMocks(); // Clear mocks so other tests are unaffected
        // jest.resetModules(); // Reset modules to ensure fresh imports
        // jest.unmock('hooks');
        // jest.restoreAllMocks();
    });
    it('should navigate to my datasets url', async () => {
        // Mock the hook implementation for this test
        let counter = 0;
        useValidatedForm.mockImplementation(() => ({
            handleSubmit: jest.fn(),
            watch: () =>
                // startDate, endDate, watchedDoiField
                ['2025-01-01', '2025-02-01', '10.1037/arc0000014'],
            setError: jest.fn(),
            control: {},
            formState: {
                isSubmitting: false,
                get isSubmitSuccessful() {
                    counter++;
                    if (counter <= 2) return false;
                    // Getter will return the latest value
                    else return true;
                },
                isDirty: false,
                errors: {},
            },
        }));
        // const { useValidatedForm } = require('hooks'); // Mocked version
        // const MyComponent = require('./AddDataCollection').default;
        // const { render } = require('@testing-library/react');

        // render(
        //     <WithReduxStore>
        //         <WithRouter>
        //             <MyComponent submitSucceeded={false} />
        //         </WithRouter>
        //     </WithReduxStore>,
        // );

        const clearNewRecordFn = jest.fn();
        const { rerender } = setup({
            submitSucceeded: false,
        });
        expect(useValidatedForm).toHaveBeenCalled();

        preview.debug();
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
});

describe('AddDataCollection test', () => {
    beforeAll(() => {
        const { useValidatedForm: originalUseValidatedForm } = jest.requireActual('hooks');
        useValidatedForm.mockImplementation(originalUseValidatedForm);
    });
    afterAll(() => {
        // mockUseNavigate.mockClear();
    });

    it('should render data set form', () => {
        const { container, getByRole } = setup();

        // expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(28);
        expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Submit for approval' })).toBeInTheDocument();
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
