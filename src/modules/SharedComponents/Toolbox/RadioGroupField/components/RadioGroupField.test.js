import React from 'react';
import RadioGroupField from './RadioGroupField';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        radioGroupFieldId: 'test',
        label: 'text',
        hideLabel: false,
        options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' }
        ],
        onChange: jest.fn(),
        ...testProps,
    };
    return rtlRender(<RadioGroupField {...props} />);
}

describe('RadioGroupField tests', () => {
    it('renders RadioGroupField component', () => {
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
        const {getByTestId } = setup({
            onChange: onChangeFn,
        });

        fireEvent.click(getByTestId('test-a-option'));
        expect(onChangeFn).toHaveBeenCalled();
    });
});
