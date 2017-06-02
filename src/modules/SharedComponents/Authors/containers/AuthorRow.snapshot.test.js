jest.dontMock('../components/AuthorRow');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorRow from '../components/AuthorRow';

function setup() {
    return shallow(<AuthorRow authorID={1} name="Test Author" removeAuthor={jest.fn()} />);
}

describe('AuthorRow snapshots test', () => {
    it('renders an Author Row', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
