import React from 'react';
import FormViewToggler from './FormViewToggler';
import { render, WithReduxStore, fireEvent } from 'test-utils';

jest.mock('../../../context');
import { useTabbedContext } from 'context';

function setup() {
    return render(
        <WithReduxStore>
            <FormViewToggler />
        </WithReduxStore>,
    );
}

describe('FormViewToggler component', () => {
    it('should render default view', () => {
        useTabbedContext.mockImplementation(() => ({
            tabbed: false,
        }));
        setup();
        const switcher = document.querySelector('input.MuiSwitch-input');
        expect(switcher).not.toHaveAttribute('checked');
    });

    it('should render tooltip for full form', () => {
        useTabbedContext.mockImplementation(() => ({
            tabbed: true,
        }));
        setup();
        const switcher = document.querySelector('input.MuiSwitch-input');
        expect(switcher).toHaveAttribute('checked');
    });

    it('should toggle form', () => {
        const toggleFn = jest.fn();
        useTabbedContext.mockImplementation(() => ({
            tabbed: false,
            toggleTabbed: toggleFn,
        }));
        const { getByRole } = setup();
        fireEvent.click(getByRole('checkbox'));
        expect(toggleFn).toHaveBeenCalled();
    });
});
