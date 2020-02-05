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
                key: '1234-1234',
                value: {
                    ulrichs: {
                        link: 'http://example.com/ulrichs?id=1234',
                        linkText: 'Architectural Journal',
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should skip a missing ulrichs', () => {
        const wrapper = setup({
            item: {
                key: '1235-1235',
                value: {
                    ulrichs: {
                        link: '',
                        linkText: '',
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
