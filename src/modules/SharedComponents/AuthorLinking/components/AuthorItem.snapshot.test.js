jest.dontMock('./AuthorItem');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorItem from './AuthorItem';

function setup({author, index}, boolProps){
    const props = {
        author: author || { rek_author: 'Test user' },
        index: index || 0,
        ...boolProps
    };

    return shallow(<AuthorItem {...props} />);
}

describe('AuthorItem renders ', () => {
    it('should be unselected and able to select author', () => {
        const wrapper = setup({}, {unlinked: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be selected', () => {
        const wrapper = setup({}, {selected: true, unlinked: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({}, {disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be unlinked and disabled', () => {
        const wrapper = setup({}, {disabled: true, unlinked: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be selected and disabled', () => {
        const wrapper = setup({}, {disabled: true, selected: true, unlinked: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be linked', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
