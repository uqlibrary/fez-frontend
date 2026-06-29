import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import Controller from './Controller';
import { fireEvent, waitFor } from 'test-utils';
import { TextField } from '../../TextField';

// eslint-disable-next-line react/prop-types
const InputComponent = ({ field, fieldState, formState }) => (
    <div>
        <TextField {...field} />
        {/* eslint-disable-next-line react/prop-types */}
        {fieldState.error?.message && <span data-testid="error">{fieldState.error.message}</span>}
        {/* eslint-disable-next-line react/prop-types */}
        {field.state?.error && <span data-testid="meta-error">state: {field.state.error}</span>}
        {/* eslint-disable-next-line react/prop-types */}
        {formState.errors?.[field.name]?.message && formState.isSubmitted && (
            <span data-testid="form-state">Form has errors</span>
        )}
    </div>
);

const setup = props => {
    const Wrapper = () => {
        const { control, handleSubmit, setFocus } = useForm();

        useEffect(() => {
            // eslint-disable-next-line react/prop-types
            if (props?.focusInputOnRender) setFocus('test-text-field');
        }, [props]);

        return (
            <form onSubmit={handleSubmit(jest.fn())}>
                <Controller
                    {...props}
                    name="test-text-field"
                    control={control}
                    render={props => <InputComponent {...props} />}
                />
                <button type="submit">Submit</button>
            </form>
        );
    };

    return render(<Wrapper />);
};

describe('Controller component', () => {
    test('should render correctly', () => {
        const { getByTestId } = setup();

        expect(getByTestId('test-text-field-input')).toBeInTheDocument();
        expect(getByTestId('test-text-field-input')).toHaveValue('');
    });

    test('should render the input field with given default value', () => {
        const { getByTestId } = setup({ state: { defaultValue: 'default-value' } });

        expect(getByTestId('test-text-field-input')).toBeInTheDocument();
        expect(getByTestId('test-text-field-input')).toHaveValue('default-value');
    });

    test("should pass on `ref` prop as `inputRef` to allow React Hook Form's `setFocus` helper to work as expected for MUI components", async () => {
        const { getByTestId } = setup({ focusInputOnRender: true });

        await waitFor(() => expect(getByTestId('test-text-field-input')).toHaveFocus());
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
});
