jest.dontMock('./StandardRighthandCard');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import StandardRighthandCard from './StandardRighthandCard';

function setup(title, help, children) {
    const props = {title, help, children};
    return shallow(<StandardRighthandCard {...props} />);
}

describe('Snapshot tests for StandardRighthandCard component', () => {
    it('renders StandardRighthandCard with title and no help icon', () => {
        const wrapper = setup('card title');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardRighthandCard with title and help button', () => {
        const wrapper = setup('Title', {title:'Help text', text:'Some help text', buttonLabel:'OK'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardRighthandCard with title and help button and some content', () => {
        const wrapper = setup('Title', {title:'Help text', text:'Some help text', buttonLabel:'OK'}, 'Some content');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});