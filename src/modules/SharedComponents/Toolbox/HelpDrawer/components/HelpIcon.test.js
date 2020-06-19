import React from 'react';
import HelpIcon from './HelpIcon';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
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
    return rtlRender(<HelpIcon {...props} />);
}

describe('HelpIcon snapshots tests', () => {
    it('renders help icon', () => {
        const { getByTestId } = setup();
        expect(getByTestId('help-icon')).toBeInTheDocument();
    });

    it('should set drawer content', () => {
        const onClickFn = jest.fn();
        const { getByTestId } = setup({
            onClick: onClickFn,
        });

        fireEvent.click(getByTestId('help-icon'));
        expect(onClickFn).toHaveBeenCalledWith('This is the title', 'This is some text', 'This is a button');
    });
});
