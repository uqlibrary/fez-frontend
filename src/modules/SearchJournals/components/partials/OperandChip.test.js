import React from 'react';
import { fireEvent, rtlRender, waitFor, within, screen } from 'test-utils';
import OperandChip from './OperandChip';

function setup(props = {}, render = rtlRender) {
    const testProps = {
        onMenuItemClick: jest.fn(),
        keyword: {
            type: 'Keyword',
            text: 'Test',
            operand: 'AND',
        },
        ...props,
    };
    return render(<OperandChip {...testProps} />, {});
}

describe('OperandChip', () => {
    it('should render', () => {
        const { getByTestId } = setup();
        expect(getByTestId('operand-chip-keyword-test')).toHaveTextContent('AND');
    });

    it('should show default operand', () => {
        const { getByTestId } = setup({ keyword: { type: 'Title', text: 'Test' } });
        expect(getByTestId('operand-chip-title-test')).toHaveTextContent('OR');
    });

    it('should show operand menu on click', () => {
        const { getByTestId, getByRole } = setup();

        fireEvent.click(getByTestId('operand-chip-keyword-test'));
        const menu = getByRole('menu');
        const menuItems = within(menu).getAllByRole('menuitem');

        expect(menuItems).toHaveLength(3);
        expect(menuItems[0]).toHaveTextContent('OR');
        expect(menuItems[1]).toHaveTextContent('AND');
        expect(menuItems[2]).toHaveTextContent('NOT');
    });

    it('should change chip text on menu item click', () => {
        const { getByTestId, getByRole } = setup();
        expect(getByTestId('operand-chip-keyword-test')).toHaveTextContent('AND');

        fireEvent.click(getByTestId('operand-chip-keyword-test'));
        fireEvent.click(within(getByRole('menu')).getByText('OR'));

        expect(getByTestId('operand-chip-keyword-test')).toHaveTextContent('OR');
    });
});
