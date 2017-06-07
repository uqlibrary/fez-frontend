jest.dontMock('../components/AuthorRow');

import {shallow} from 'enzyme';
import React from 'react';
import AuthorRow from '../components/AuthorRow';
import sinon from 'sinon';

function setup(onButtonClick) {
    return shallow(<AuthorRow authorID={1} name="Test Author" removeAuthor={onButtonClick} />);
}

describe('AuthorRow snapshots test', () => {
    it('renders multiple Author Rows', () => {
        const onButtonClick = sinon.spy();
        const wrapper = setup(onButtonClick);

        wrapper.find('RaisedButton').simulate('click');
        expect(onButtonClick.calledOnce).toEqual(true);
    });
});
