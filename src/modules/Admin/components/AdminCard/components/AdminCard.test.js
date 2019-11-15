import { AdminCard, Cards } from './AdminCard';

function setup(testProps, isShallow = true) {
    const props = {
        title: 'card title',
        classes: {
            card: 'testClass',
        },
        ...testProps,
    };
    return getElement(Cards, props, isShallow);
}

describe('Cards component', () => {
    it('renders with title and no help icon', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with title and help button', () => {
        const wrapper = setup({
            help: {
                title: 'help',
                text: 'help text',
                buttonLabel: 'OK',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with custom colours and full height', () => {
        const wrapper = setup({
            customBackgroundColor: '#fcc',
            customTitleColor: '#111',
            customTitleBgColor: '#ccc',
            fullHeight: true,
            noPadding: true,
            primaryHeader: true,
            classes: {
                cardHeaderPurple: 'purple',
                cardContentNoPadding: 'no-padding',
                cardHeaderPrimary: '#555',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with square top and accent header', () => {
        const wrapper = setup({
            squareTop: true,
            accentHeader: true,
            classes: {
                cardHeaderAccent: '#333',
            },
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('AdminCard component', () => {
    it('should render StyledCard with same props', () => {
        const wrapper = getElement(
            AdminCard,
            {
                test1: 'test1value',
                test2: 'test2value',
            },
            true,
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
