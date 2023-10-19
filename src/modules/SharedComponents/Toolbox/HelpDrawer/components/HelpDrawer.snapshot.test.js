import React from 'react';
import { HelpDrawer } from './HelpDrawer';
import { rtlRender } from 'test-utils';

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
    return rtlRender(<HelpDrawer {...props} />);
}

describe('HelpDrawer snapshots tests', () => {
    it('renders menu', () => {
        const hdText = 'Integer mattis rutrum velit nec posuere. Quisque rhoncus quam elit.';
        const { baseElement } = setup({
            title: 'HelpDrawer Title',
            text: hdText,
            open: true,
            buttonLabel: 'Close',
        });

        expect(baseElement).toMatchSnapshot();
    });

    it('renders text as react children', () => {
        const { baseElement } = setup({
            title: 'HelpDrawer title',
            text: (
                <p>
                    <span>Test text</span>
                </p>
            ),
        });
        expect(baseElement).toMatchSnapshot();
    });

    it('renders text as react element', () => {
        const { baseElement } = setup({
            title: 'HelpDrawer title',
            text: <span>Test text</span>,
        });
        expect(baseElement).toMatchSnapshot();
    });
});
