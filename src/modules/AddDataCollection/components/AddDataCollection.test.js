import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen } from 'test-utils';
import { useValidatedForm } from 'hooks';
import userEvent from '@testing-library/user-event';
import { useWatch } from 'react-hook-form';

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
        <React.StrictMode>
            <WithReduxStore>
                <WithRouter>
                    <AddDataCollection {...props} />
                </WithRouter>
            </WithReduxStore>
        </React.StrictMode>,
    );
}

jest.mock('hooks', () => ({
    useValidatedForm: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useWatch: jest.fn(),
}));

describe('AddDataCollection test mocking hooks', () => {
    it('should navigate to my datasets url', async () => {
        mockApi
            .onGet('records/search', {
                params: { rule: 'lookup', search_key: 'doi', lookup_value: '10.1037/arc0000014' },
            })
            .reply(() => [200, { total: 0, data: [] }]);

        useWatch.mockImplementation(() => ['2025-01-01', '2025-02-01']);
        // Mock the hook implementation for this test
        let counter = 0;
        useValidatedForm.mockImplementation(() => ({
            handleSubmit: jest.fn(),
            // watch: () =>
            //     // startDate, endDate, watchedDoiField
            //     ['2025-01-01', '2025-02-01', '10.1037/arc0000014'],
            setError: jest.fn(),
            control: {
                values: {
                    'fez_record_search_key_start_date.rek_start_date': '2025-01-01',
                    'fez_record_search_key_end_date.rek_end_date': '2025-02-01',
                },
            },
            formState: {
                isSubmitting: false,
                get isSubmitSuccessful() {
                    counter++;
                    return counter === 1 ? false : true;
                },
                isDirty: false,
                errors: {},
            },
        }));

        const { rerender, getByTestId } = setup({
            submitSucceeded: false,
        });
        expect(useValidatedForm).toHaveBeenCalled();

        setup(
            {
                submitSucceeded: true,
            },
            rerender,
        );
        await userEvent.click(getByTestId('submit-data-collection'));
        await waitFor(() => expect(screen.getByTestId('confirm-dialog-box')));

        fireEvent.click(screen.getByTestId('confirm-dialog-box'));

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
        useWatch.mockImplementation(() => ['2025-01-01', '2025-02-01']);
        const { container, rerender } = setup();
        setup({ newRecordFileUploadingOrIssueError: true, submitSucceeded: true }, rerender);
        expect(container).toMatchSnapshot();
    });

    it('should not generate an error when licence locale is missing', () => {
        // licence text not supplied
        expect(licenseText()).toMatchSnapshot();

        // licence text lacks required internal structure
        expect(licenseText(['something'])).toMatchSnapshot();
    });
});
