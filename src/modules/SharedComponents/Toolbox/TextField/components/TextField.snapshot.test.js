import React from 'react';
import { TextFieldWrapper } from './TextField';
import filterProps from '../../helpers/_filterProps';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = { ...testProps };
    const consolidatedProps = filterProps(props, TextFieldWrapper.propTypes);
    return rtlRender(<TextFieldWrapper {...consolidatedProps} textFieldId="test" />);
}

describe('TextFieldWrapper snapshots tests', () => {
    const testProps = {
        name: 'testField',
        type: 'text',
        fullWidth: true,
        floatingLabelText: 'This is a test textfield component',
        ariaLabelledby: 'fake-id',
    };

    it('renders TextField component', () => {
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });

    it('renders TextField component appending a class', () => {
        const { container } = setup({
            ...testProps,
            className: 'requiredField',
        });
        expect(container).toMatchSnapshot();
    });

    it('renders TextField component with shrink:true', () => {
        const { container } = setup({
            ...testProps,
            floatinglabelfixed: 'true',
            label: 'test',
        });
        expect(container).toMatchSnapshot();
    });
});
