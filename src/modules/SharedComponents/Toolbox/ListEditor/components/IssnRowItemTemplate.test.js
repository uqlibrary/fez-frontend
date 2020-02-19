import { IssnRowItemTemplate } from './IssnRowItemTemplate';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        item: {},
        ...testProps,
    };
    return getElement(IssnRowItemTemplate, props, args);
}

describe('IssnRowItemTemplate component', () => {
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
                    sherpaRomeo: {
                        link: 'http://example.com/sherpa?issn=1234-1234',
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should skip missing ulrichs or sherparomeo', () => {
        const wrapper = setup({
            item: {
                key: '1235-1235',
                value: {
                    ulrichs: {
                        link: '',
                        linkText: '',
                    },
                    sherpaRomeo: {
                        link: '',
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
