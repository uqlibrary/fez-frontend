import {HelpDrawer} from './HelpDrawer';


function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        classes: {},
        theme: {palette:{white:{main: '#FFFFFF'}}},
        open: testProps.open,
        title: testProps.title,
        text: testProps.text,
        hide: () => {},
        buttonLabel: testProps.buttonLabel
    };
    return getElement(HelpDrawer, props, isShallow);
}

describe('HelpDrawer snapshots tests', () => {
    it('renders menu', () => {
        const hdText = 'Integer mattis rutrum velit nec posuere. Quisque rhoncus quam elit.';
        const wrapper = setup({title: 'HelpDrawer Title', text: hdText, open: true, buttonLabel: 'Close'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
