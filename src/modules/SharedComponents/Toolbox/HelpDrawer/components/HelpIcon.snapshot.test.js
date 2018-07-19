import HelpIcon from './HelpIcon';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        title: testProps.title || 'This is the title',
        text: testProps.text || 'This is some text',
        buttonLabel: testProps.buttonLabel || 'This is a button',
        tooltip: testProps.tooltip || 'This is a tooltip',
        onClick: testProps.onClick || jest.fn()
    };
    return getElement(HelpIcon, props, isShallow);
}

describe('HelpIcon snapshots tests', () => {
    it('renders help icon', () => {
        const wrapper = setup({});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
