import React from 'react';
import CheckboxGroup from './CheckboxGroup';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        checkboxGroupId: 'test',
        options: [
            { label: 'option A', value: 'a' },
            { label: 'option b', value: 'b', appendTextField: true },
        ],
        onChange: jest.fn(),
        ...testProps,
    };
    return rtlRender(<CheckboxGroup {...props} />);
}

describe('CheckboxGroup tests', () => {
    it('renders CheckboxGroup component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders an error', () => {
        const props = {
            error: true,
            errorText: 'Something bad happened',
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('should call onChange', () => {
        const onChangeFn = jest.fn();
        const { getByTestId } = setup({
            onChange: onChangeFn,
        });

        fireEvent.click(getByTestId('test-a-option'));
        expect(onChangeFn).toHaveBeenCalledWith({ a: 'a' });

        // uncheck
        fireEvent.click(getByTestId('test-a-option'));
        expect(onChangeFn).toHaveBeenCalledWith({ a: 'a' });
    });

    it('should update textfield value', () => {
        const onChangeFn = jest.fn();
        const { getByTestId } = setup({
            onChange: onChangeFn,
        });

        fireEvent.change(getByTestId('test-b-option-text'), { target: { value: 'textfield b' } });
        expect(onChangeFn).toHaveBeenCalledWith({ bText: 'textfield b' });
    });

    it('should remove textfield value', () => {
        const onChangeFn = jest.fn();
        const { getByTestId } = setup({
            onChange: onChangeFn,
            value: { bText: 'value' },
        });

        // should remove from data
        fireEvent.change(getByTestId('test-b-option-text'), { target: { value: '' } });
        expect(onChangeFn).toHaveBeenCalledWith({});
    });
});
