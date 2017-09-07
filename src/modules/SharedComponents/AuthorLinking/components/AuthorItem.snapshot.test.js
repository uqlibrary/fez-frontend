jest.dontMock('./AuthorItem');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorItem from './AuthorItem';

function setup({author, index}, boolProps, onAuthorSelected){
    const props = {
        author: author || { rek_author: 'Test user' },
        index: index || 0,
        ...boolProps,
        onAuthorSelected: onAuthorSelected || undefined
    };

    return shallow(<AuthorItem {...props} />);
}

describe('AuthorItem renders ', () => {
    it('should be unselected and able to select author', () => {
        const wrapper = setup({}, {linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be selected', () => {
        const wrapper = setup({}, {selected: true, linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({}, {disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be linked and disabled', () => {
        const wrapper = setup({}, {disabled: true, linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be selected and disabled', () => {
        const wrapper = setup({}, {disabled: true, selected: true, linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be linked', () => {
        const wrapper = setup({}, {linked: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onAuthorSelected', () => {
        const onAuthorSelected = jest.fn();
        const wrapper = setup({}, {linked: false}, onAuthorSelected);
        wrapper.instance()._selectAuthor();
        expect(onAuthorSelected).toHaveBeenCalled();
    })
});
