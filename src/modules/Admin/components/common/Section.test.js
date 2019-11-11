import { Section, GroupsWithinCard, GroupsWithoutCard } from './Section';

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        ...testProps,
    };

    return getElement(Section, props, args);
};

describe('Section component', () => {
    it('should render default view', () => {
        const wrapper = setup({
            disabled: false,
            cards: [{ title: 'Title' }],
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        const wrapper2 = setup({
            disabled: false,
            cards: [{}],
        });
        expect(toJson(wrapper2)).toMatchSnapshot();
    });
});

describe('GroupsWithinCard component', () => {
    it('should render default view', () => {
        const props = {
            title: 'Title',
            groups: [['test']],
        };
        const args = { isShallow: true };
        const wrapper = getElement(GroupsWithinCard, props, args);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('GroupsWithoutCard component', () => {
    it('should render default view', () => {
        const props = {
            groups: [['test']],
        };
        const args = { isShallow: true };
        const wrapper = getElement(GroupsWithoutCard, props, args);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
