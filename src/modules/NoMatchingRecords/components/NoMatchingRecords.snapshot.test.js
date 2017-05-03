jest.dontMock('./NoMatchingRecords');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import NoMatchingRecords from './NoMatchingRecords';

function setup() {
    const props = {
        title: 'No Records',
        explanationText: ' Lorem ipsum'
    };
    return shallow(<NoMatchingRecords {...props} />);
}

describe('No matching record component snapshots tests', () => {
    it('renders default no matching record component', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
