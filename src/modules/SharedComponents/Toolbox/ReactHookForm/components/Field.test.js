import React from 'react';
import { render } from '@testing-library/react';
import Field, { validateHandler } from './Field';
import Controller from './Controller';

jest.mock('./Controller', () => ({
    __esModule: true,
    default: jest.fn(({ render }) =>
        render({
            field: {
                value: '',
                onChange: jest.fn(),
            },
        }),
    ),
}));

const mockControl = {}; // Mock control object
const mockComponent = jest.fn(({ onChange, value, ...props }) => (
    <input value={value || ''} onChange={onChange} {...props} data-testid="field-input" />
));

const setup = props =>
    render(<Field name="testField" control={mockControl} component={mockComponent} {...{ validate: [], ...props }} />);

describe('Field component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks for each test
    });

    it('should render correctly with the provided component', () => {
        const { getByTestId } = setup();

        // verify that the Controller is called with the correct props
        expect(Controller).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'testField', control: mockControl }),
            expect.any(Object),
        );

        // verify that the component renders correctly
        expect(getByTestId('field-input')).toBeInTheDocument();
    });

    it('should pass props to the child component', () => {
        const { getByTestId } = setup({ placeholder: 'Enter text here', maxLength: 10 });

        const input = getByTestId('field-input');
        expect(input).toHaveAttribute('placeholder', 'Enter text here');
        expect(input).toHaveAttribute('maxLength', '10');
    });

    describe('validateHandler', () => {
        it('should return null if passed in validators are not an array', () => {
            expect(validateHandler('test', 'test')).toBeNull();
        });

        it("should ignore validators that can't be invoked", () => {
            expect(validateHandler('test', ['test'])).toBeNull();
        });

        it('should validate value using validator in "left to right" order', () => {
            expect(
                validateHandler('test', { fieldA: 'test', fieldB: 'test2' }, [
                    value => (value !== 'test' ? 'fist validator executed' : null),
                    (value, formValues) =>
                        value === 'test' && formValues.fieldA === 'test' ? ' second validator executed ' : null,
                ]),
            ).toBe('second validator executed');
        });

        it('should ignore empty error messages', () => {
            expect(
                validateHandler('test', { fieldA: 'test', fieldB: 'test2' }, [
                    value => (value !== 'test' ? 'fist validator executed' : null),
                    value => (value === 'test' ? ' ' : null),
                ]),
            ).toBe(null);
        });

        it('should return null if all validators passes', () => {
            expect(
                validateHandler('test', { fieldA: 'test', fieldB: 'test2' }, [
                    value => (value === 1 ? 'fist validator executed' : null),
                    value => (value === 2 ? 'second validator executed' : null),
                ]),
            ).toBe(null);
        });
    });
});
