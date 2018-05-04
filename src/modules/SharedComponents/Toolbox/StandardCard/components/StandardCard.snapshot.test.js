jest.dontMock('./StandardCard');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import StandardCard from './StandardCard';

function setup(title, help) {
    const props = {title, help};
    return shallow(<StandardCard {...props} />);
}

describe('Snapshot tests for StandardCard component', () => {
    it('renders StandardCard with title and no help icon', () => {
        const wrapper = setup('card title');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardCard with title and help button', () => {
        const wrapper = setup('card title', {title: 'help', text: ('help text'), buttonLabel: 'OK'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});