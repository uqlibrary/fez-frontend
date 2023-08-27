import React from 'react';
import SelectField from './SelectField';
import filterProps from '../../helpers/_filterProps';
import { rtlRender, fireEvent } from 'test-utils';
import MenuItem from '@mui/material/MenuItem';

function setup(testProps) {
    const props = {
        name: 'selectfield',
        type: 'text',
        fullWidth: true,
        floatingLabelText: 'test selectfield component',
        selectFieldId: 'test',
        ...testProps,
    };
    const consolidatedProps = filterProps(props, SelectField.propTypes);
    return rtlRender(<SelectField {...consolidatedProps} {...props} />);
}

describe('SelectfieldWrapper snapshots tests', () => {
    it('renders SelectField component', () => {
        const props = {
            name: 'selectfield',
            type: 'text',
            fullWidth: true,
            floatingLabelText: 'This is a test selectfield component',
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('renders an error', () => {
        const props = {
            name: 'selectfield',
            error: true,
            errorText: 'Something bad happened',
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('should call onChange', () => {
        const onChangeFn = jest.fn();
        const onBlurFn = jest.fn();
        const { getByRole, getByTestId } = setup({
            input: {
                onChange: onChangeFn,
                onBlur: onBlurFn,
                value: 'test1',
            },
            children: [
                <MenuItem value={'test1'} key={0}>
                    test1
                </MenuItem>,
                <MenuItem value={'test2'} key={1}>
                    test2
                </MenuItem>,
            ],
        });

        fireEvent.mouseDown(getByTestId('test-select'));
        fireEvent.click(getByRole('option', { name: 'test2' }));
        expect(onChangeFn).toHaveBeenCalledWith('test2');

        fireEvent.blur(getByTestId('test-select'));
        expect(onBlurFn).toHaveBeenCalledWith('test1');
    });
});
