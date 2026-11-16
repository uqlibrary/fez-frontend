import React, { createRef } from 'react';
import HelpIcon from './HelpIcon';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { rtlRender, fireEvent, WithReduxStore } from 'test-utils';

import * as actions from '../actions';

function setup(testProps = {}) {
    const props = {
        classes: {},
        theme: { palette: { white: { main: '#FFFFFF' } } },
        title: 'This is the title',
        text: 'This is some text',
        buttonLabel: 'This is a button',
        tooltip: 'This is a tooltip',
        ...testProps,
    };
    return rtlRender(
        <WithReduxStore>
            <HelpIcon {...props} />
        </WithReduxStore>,
    );
}

describe('HelpIcon snapshots tests', () => {
    afterEach(() => jest.clearAllMocks());

    it('renders help icon', () => {
        const { getByTestId } = setup();
        expect(getByTestId('help-icon')).toBeInTheDocument();
    });

    it('renders help icon', () => {
        const { getByTestId } = setup({ testId: 'test' });
        expect(getByTestId('help-icon-test')).toBeInTheDocument();
    });

    it('should include the title in the aria-label for the default help icon', () => {
        const { getByTestId } = setup();
        expect(getByTestId('help-icon')).toHaveAttribute('aria-label', 'This is the title - This is a tooltip');
    });

    it('should include the title in the aria-label when HelpOutlineIcon is passed explicitly', () => {
        const { getByTestId } = setup({ IconComponent: HelpOutlineIcon });
        expect(getByTestId('help-icon')).toHaveAttribute('aria-label', 'This is the title - This is a tooltip');
    });

    it('should use only the tooltip as aria-label for a non-help icon', () => {
        const { getByTestId } = setup({ IconComponent: KeyboardIcon });
        expect(getByTestId('help-icon')).toHaveAttribute('aria-label', 'This is a tooltip');
    });

    it('should use the default tooltip text in the aria-label when no tooltip is given', () => {
        const { getByTestId } = setup({ tooltip: undefined });
        expect(getByTestId('help-icon')).toHaveAttribute(
            'aria-label',
            'This is the title - Click for more information',
        );
    });

    it('should use only the tooltip as aria-label when no title is given', () => {
        const { getByTestId } = setup({ title: undefined });
        expect(getByTestId('help-icon')).toHaveAttribute('aria-label', 'This is a tooltip');
    });

    it('should open drawer', () => {
        const showFn = jest.spyOn(actions, 'show');
        const { getByTestId } = setup();

        fireEvent.click(getByTestId('help-icon'));
        expect(showFn).toHaveBeenCalledWith('This is the title', 'This is some text', 'This is a button');
    });

    it('should allow to be disabled', () => {
        const showFn = jest.spyOn(actions, 'show');
        const { getByTestId } = setup({ disabled: true });

        fireEvent.click(getByTestId('help-icon'));
        expect(showFn).not.toHaveBeenCalled();
    });

    it('should expose openDrawer via ref', () => {
        const showFn = jest.spyOn(actions, 'show');
        const ref = createRef();

        expect(showFn).not.toHaveBeenCalled();
        setup({ ref });

        ref.current?.openDrawer();
        expect(showFn).toHaveBeenCalledWith('This is the title', 'This is some text', 'This is a button');
    });
});
