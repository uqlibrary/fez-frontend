import { IssnUlrichLinkTemplate } from './IssnUlrichLinkTemplate';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        item: {},
        ...testProps,
    };
    return getElement(IssnUlrichLinkTemplate, props, args);
}

describe('IssnUlrichLinkTemplate component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a value', () => {
        const wrapper = setup({
            item: {
                value: 'http://example.com/ulrichs?id=1234',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
