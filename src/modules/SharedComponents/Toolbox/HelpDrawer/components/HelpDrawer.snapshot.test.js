import React from 'react';
import { HelpDrawer } from './HelpDrawer';
import HelpDrawerWithStyles from './HelpDrawer';

function setup(testProps = {}) {
    const props = {
        classes: {},
        theme: { palette: { white: { main: '#FFFFFF' } } },
        open: true,
        title: 'Test title',
        text: 'Test text',
        hide: jest.fn(),
        buttonLabel: 'Test OK',
        ...testProps,
    };
    return getElement(HelpDrawer, props);
}

describe('HelpDrawer snapshots tests', () => {
    it('renders menu', () => {
        const hdText = 'Integer mattis rutrum velit nec posuere. Quisque rhoncus quam elit.';
        const wrapper = setup({ title: 'HelpDrawer Title', text: hdText, open: true, buttonLabel: 'Close' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders text as react children', () => {
        const wrapper = setup({
            title: 'HelpDrawer title',
            text: (
                <p>
                    <span>Test text</span>
                </p>
            ),
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders text as react element', () => {
        const wrapper = setup({
            title: 'HelpDrawer title',
            text: <span>Test text</span>,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with styles', () => {
        const wrapper = getElement(HelpDrawerWithStyles, {
            open: true,
            title: 'Test title',
            text: 'Test text',
            hide: jest.fn(),
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
