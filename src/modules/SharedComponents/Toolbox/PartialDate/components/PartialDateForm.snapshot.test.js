jest.dontMock('./PartialDateForm');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PartialDateForm from './PartialDateForm';

function setup(props) {
    return shallow(<PartialDateForm {...props} />);
}

describe('PartialDateForm snapshots tests', () => {
    it('renders PartialDateForm component', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            onChange: () => {}
        };

        const wrapper = setup(props);

        let tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders PartialDateForm component 2', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            className: 'requiredField',
            onChange: () => {}
        };

        const wrapper = setup(props);

        let tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders PartialDateForm component 3', () => {
        const props = {
            name: 'partialDate',
            allowPartial: false,
            className: 'requiredField',
            onChange: () => {}
        };

        const wrapper = setup(props);

        let tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
