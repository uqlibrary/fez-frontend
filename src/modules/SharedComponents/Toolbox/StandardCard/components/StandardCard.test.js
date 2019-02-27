import {Cards} from './StandardCard';

function setup(testProps, isShallow = true) {
    const props = {
        title: 'card title',
        classes: {
            card: 'testClass'
        },
        ...testProps
    };
    return getElement(Cards, props, isShallow);
}

describe('StandardCard component', () => {

    it('renders with title and no help icon', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with title and help button', () => {
        const wrapper = setup({
            help: {
                title: 'help',
                text: 'help text',
                buttonLabel: 'OK'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with custom colours and full height', () => {
        const wrapper = setup({
            customBackgroundColor: '#fcc',
            customTitleColor: '#111',
            fullHeight: true,
            noPadding: true,
            darkHeader: true,
            classes: {
                cardHeaderPurple: 'purple',
                cardContentNoPadding: 'no-padding'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
