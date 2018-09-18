import {AuthorItem} from './AuthorItem';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        author: testProps.author || {rek_author: 'Test user'},
        index: testProps.index || 0,
        onAuthorSelected: testProps.onAuthorSelected || undefined,
        type: 'author',
        classes: {
            authorLinkIcon: 'authorLinkIcon',
            buttonBase: 'buttonBase',
            authorOrder: 'authorOrder'
        },
        ...testProps
    };
    return getElement(AuthorItem, props, isShallow);
}

describe('AuthorItem renders ', () => {
    it('should be unselected and able to select author', () => {
        const wrapper = setup({linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be selected', () => {
        const wrapper = setup({selected: true, linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be linked and disabled', () => {
        const wrapper = setup({disabled: true, linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be selected and disabled', () => {
        const wrapper = setup({disabled: true, selected: true, linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be linked', () => {
        const wrapper = setup({linked: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onAuthorSelected', () => {
        const onAuthorSelected = jest.fn();
        const wrapper = setup({linked: false, onAuthorSelected: onAuthorSelected});
        wrapper.instance()._selectAuthor();
        expect(onAuthorSelected).toHaveBeenCalled();
    })
});
