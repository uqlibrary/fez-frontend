import { HelpIcon } from './HelpIcon';
import HelpIconWithStyles from './HelpIcon';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        theme: { palette: { white: { main: '#FFFFFF' } } },
        title: 'This is the title',
        text: 'This is some text',
        buttonLabel: 'This is a button',
        tooltip: 'This is a tooltip',
        onClick: jest.fn(),
        ...testProps,
    };
    return getElement(HelpIcon, props, isShallow);
}

describe('HelpIcon snapshots tests', () => {
    it('renders help icon', () => {
        const wrapper = setup({});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should set drawer content', () => {
        const onClickFn = jest.fn();
        const wrapper = setup({
            onClick: onClickFn,
        });
        wrapper.find('WithStyles(IconButton)').simulate('click');
        expect(onClickFn).toHaveBeenCalledWith('This is the title', 'This is some text', 'This is a button');
    });

    it('should render with styles', () => {
        const wrapper = getElement(HelpIconWithStyles, { text: 'This is text' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
