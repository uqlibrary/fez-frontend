jest.dontMock('./InlineLoader');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import InlineLoader from './InlineLoader';

function setup(message) {
    const props = {message};
    return shallow(<InlineLoader {...props} />);
}

describe('InlineLoader snapshots tests', () => {
    it('renders loader', () => {
        const wrapper = setup('Waiting to load...');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});