jest.dontMock('./TextField');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import TextField from './TextField';

import filterProps from '../../helpers/_filterProps';

function setup(props) {
    const consolidatedProps = filterProps(props, TextField.propTypes);
    return shallow(<TextField {...consolidatedProps} />);
}

describe('TextFieldWrapper snapshots tests', () => {
    it('renders TextField component', () => {
        const props =
            {
                name: 'testField',
                type: 'text',
                fullWidth: true,
                floatingLabelText: 'This is a test textfield component'
            };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
    it('renders TextField component appending a class', () => {
        const props =
            {
                name: 'testField',
                type: 'text',
                fullWidth: true,
                floatingLabelText: 'This is a test textfield component',
                className: 'requiredField'
            };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
