import { LinkInfoTemplate } from './LinkInfoTemplate';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        item: {},
        ...testProps,
    };
    return getElement(LinkInfoTemplate, props, args);
}

describe('LinkInfoTemplate component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
