import React from 'react';
import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import Controller from './AdminController';
import { fireEvent, waitFor } from 'test-utils';

// Mock the base Controller to simulate field.value being undefined
jest.mock('modules/SharedComponents/Toolbox/ReactHookForm', () => {
    const originalModule = jest.requireActual('modules/SharedComponents/Toolbox/ReactHookForm');
    return {
        ...originalModule,
        Controller: ({ render, simulateUndefinedValue, ...props }) => {
            // Use the original Controller but intercept the render to simulate undefined value
            return originalModule.Controller({
                ...props,
                render: renderProps => {
                    if (simulateUndefinedValue) {
                        // Simulate the case where field.value is undefined
                        return render({
                            ...renderProps,
                            field: {
                                ...renderProps.field,
                                value: undefined,
                            },
                        });
                    }
                    return render(renderProps);
                },
            });
        },
    };
});

// eslint-disable-next-line react/prop-types
const MockInput = ({ field, fieldState, formState }) => (
    <div>
        {/* eslint-disable-next-line react/prop-types */}
        <input {...field} value={field.value ?? ''} data-testid="field-input" />
        {/* eslint-disable-next-line react/prop-types */}
        {fieldState.error?.message && <span data-testid="error">{fieldState.error.message}</span>}
        {/* eslint-disable-next-line react/prop-types */}
        {field.state?.error && <span data-testid="meta-error">state: {field.state.error}</span>}
        {/* eslint-disable-next-line react/prop-types */}
        {formState.errors?.mockInput?.message && formState.isSubmitted && (
            <span data-testid="form-state">Form has errors</span>
        )}
    </div>
);

const setup = (props = {}, renderer = render) => {
    const { state, ...restProps } = props;
    const Wrapper = () => {
        const { control, handleSubmit } = useForm(state || {});
        return (
            <form onSubmit={handleSubmit(jest.fn())}>
                <Controller
                    {...restProps}
                    name="mockInput"
                    control={control}
                    render={props => <MockInput {...props} />}
                />
                <button type="submit">Submit</button>
            </form>
        );
    };

    return renderer(<Wrapper />);
};

describe('Controller component', () => {
    test('should render correctly', () => {
        const { getByTestId } = setup();

        expect(getByTestId('field-input')).toBeInTheDocument();
        expect(getByTestId('field-input')).toHaveValue('');
    });

    test('should render the input field with given supplied value', () => {
        const { getByTestId } = setup({
            state: { defaultValues: { mockInput: 'default-value' }, values: { mockInput: 'initial-value' } },
        });

        expect(getByTestId('field-input')).toBeInTheDocument();
        expect(getByTestId('field-input')).toHaveValue('initial-value');
    });

    test('should pass error as in field.state prop and formState', async () => {
        const { getByTestId, getByText } = setup({
            rules: { validate: value => (!value.trim() ? 'This field is required' : null) },
        });

        fireEvent.click(getByText('Submit'));

        await waitFor(() => expect(getByTestId('error')).toBeInTheDocument());

        expect(getByTestId('error')).toHaveTextContent('This field is required');
        expect(getByTestId('meta-error')).toHaveTextContent('state: This field is required');
        expect(getByTestId('form-state')).toHaveTextContent('Form has errors');
    });

    test('should set field value to default value when field value is undefined', () => {
        // This tests the case where initial RHF form data changes after form has initialised.
        // In these cases, the AdminController should use defaultValue when field.value is undefined
        const { getByTestId } = setup({
            simulateUndefinedValue: true,
            state: {
                defaultValues: { mockInput: 'default-value' },
            },
        });

        expect(getByTestId('field-input')).toHaveValue('default-value');
    });
});
