jest.dontMock('./Checkbox');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Checkbox from './Checkbox';

import filterProps from '../../helpers/_filterProps';

function setup(props) {
    const consolidatedProps = filterProps(props, Checkbox.propTypes);
    return shallow(<Checkbox {...consolidatedProps} />);
}

describe('CheckboxWrapper snapshots tests', () => {
    it('renders Checkbox component', () => {
        const props =
            {
                label: 'This is a test checkbox component'
            };

        const app = setup(props);
        expect(toJson(app)).toMatchSnapshot();
    });
});
