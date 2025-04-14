import React from 'react';
import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import Controller from './Controller';
import { fireEvent, waitFor } from 'test-utils';

// eslint-disable-next-line react/prop-types
const MockInput = ({ field, fieldState, formState }) => (
    <div>
        <input {...field} data-testid="field-input" />
        {/* eslint-disable-next-line react/prop-types */}
        {fieldState.error?.message && <span data-testid="error">{fieldState.error.message}</span>}
        {/* eslint-disable-next-line react/prop-types */}
        {field.meta?.error && <span data-testid="meta-error">meta: {field.meta.error}</span>}
        {/* eslint-disable-next-line react/prop-types */}
        {formState.errors?.mockInput?.message && formState.isSubmitted && (
            <span data-testid="form-state">Form has errors</span>
        )}
    </div>
);

const setup = props => {
    const Wrapper = () => {
        const { control, handleSubmit } = useForm();

        return (
            <form onSubmit={handleSubmit(jest.fn())}>
                <Controller {...props} name="mockInput" control={control} render={props => <MockInput {...props} />} />
                <button type="submit">Submit</button>
            </form>
        );
    };

    return render(<Wrapper />);
};

describe('Controller component', () => {
    test('should render correctly', () => {
        const { getByTestId } = setup();

        expect(getByTestId('field-input')).toBeInTheDocument();
        expect(getByTestId('field-input')).toHaveValue('');
    });

    test('should render the input field with given default value', () => {
        const { getByTestId } = setup({ defaultValue: 'default-value' });

        expect(getByTestId('field-input')).toBeInTheDocument();
        expect(getByTestId('field-input')).toHaveValue('default-value');
    });

    test('should pass error as in field.meta prop and formState', async () => {
        const { getByTestId, getByText } = setup({
            rules: { validate: value => (!value.trim() ? 'This field is required' : null) },
        });

        fireEvent.click(getByText('Submit'));

        await waitFor(() => expect(getByTestId('error')).toBeInTheDocument());

        expect(getByTestId('error')).toHaveTextContent('This field is required');
        expect(getByTestId('meta-error')).toHaveTextContent('meta: This field is required');
        expect(getByTestId('form-state')).toHaveTextContent('Form has errors');
    });
});
