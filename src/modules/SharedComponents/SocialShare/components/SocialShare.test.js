import { SocialShare } from './SocialShare';
import { journalArticle } from 'mock/data/testing/records';

function setup(testProps, isShallow = true, requiresStore = false, context = {}) {
    const props = {
        publication: journalArticle,
        services: ['facebook', 'twitter', 'linkedin', 'researchgate', 'mendeley', 'email', 'print'],
        ...testProps,
    };
    return getElement(SocialShare, props, isShallow, requiresStore, context);
}

describe('Component SocialShare', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should fire print method on click', () => {
        global.print = jest.fn();
        const wrapper = setup({});
        wrapper.find('WithStyles(ExternalLink)#print').simulate('click');
        expect(global.print).toHaveBeenCalled();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
