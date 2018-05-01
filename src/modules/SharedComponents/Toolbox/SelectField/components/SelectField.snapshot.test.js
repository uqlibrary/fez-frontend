jest.dontMock('./SelectField');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import SelectField from './SelectField';

import filterProps from '../../helpers/_filterProps';

function setup(props) {
    const consolidatedProps = filterProps(props, SelectField.propTypes);
    return shallow(<SelectField {...consolidatedProps} />);
}

describe('SelectfieldWrapper snapshots tests', () => {
    it('renders SelectField component', () => {
        const props =
            {
                name: 'selectfield',
                type: 'text',
                fullWidth: true,
                floatingLabelText: 'This is a test selectfield component'
            };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
