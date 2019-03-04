import {AuthorItem} from './AuthorItem';
import AuthorItemWithStyles from './AuthorItem';

const getProps = (testProps = {}) => ({
    author: {rek_author: 'Test user'},
    index: 0,
    onAuthorSelected: undefined,
    type: 'author',
    classes: {
        authorLinkIcon: 'authorLinkIcon',
        buttonBase: 'buttonBase',
        authorOrder: 'authorOrder'
    },
    ...testProps
});

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    return getElement(AuthorItem, getProps(testProps), isShallow);
}

describe('AuthorItem renders ', () => {
    it('should be unselected and able to select author', () => {
        const wrapper = setup({linked: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be rendered with styles', () => {
        const wrapper = getElement(AuthorItemWithStyles, getProps());
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
