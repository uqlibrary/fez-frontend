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
        const { container } = setup();

        expect(container).toMatchSnapshot();
    });

    it('should render tooltip for full form', () => {
        useTabbedContext.mockImplementation(() => ({
            tabbed: true,
        }));
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should toggle form', () => {
        const toggleFn = jest.fn();
        useTabbedContext.mockImplementation(() => ({
            tabbed: false,
            toggleTabbed: toggleFn,
        }));
        const { getByRole } = setup();
        fireEvent.click(getByRole('switch'));
        expect(toggleFn).toHaveBeenCalled();
    });
});
