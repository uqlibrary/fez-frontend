import React from 'react';
import HelpIcon from './HelpIcon';
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
    it('renders help icon', () => {
        const { getByTestId } = setup();
        expect(getByTestId('help-icon')).toBeInTheDocument();
    });

    it('renders help icon', () => {
        const { getByTestId } = setup({ testId: 'test' });
        expect(getByTestId('help-icon-test')).toBeInTheDocument();
    });

    it('should set drawer content', () => {
        const showFn = jest.spyOn(actions, 'show');
        const { getByTestId } = setup();

        fireEvent.click(getByTestId('help-icon'));
        expect(showFn).toHaveBeenCalledWith('This is the title', 'This is some text', 'This is a button');
    });
});
