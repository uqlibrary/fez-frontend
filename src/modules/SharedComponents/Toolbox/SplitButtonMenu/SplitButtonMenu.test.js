import React from 'react';
import { render, screen, userEvent, waitFor } from 'test-utils';
import SplitButtonMenu from './SplitButtonMenu';

const onClick = jest.fn();
const onItemSelect = jest.fn();
const onSettings = jest.fn();

const items = [
    { id: 1, label: 'List 1' },
    { id: 2, label: 'List 2' },
    { id: 3, label: 'List 3' },
];

const setup = (testProps = {}) => {
    const props = {
        items,
        selectedIndex: 1,
        onClick,
        onItemSelect,
        onSettings,
        label: item => `Add to ${item.label}`,
        ...testProps,
    };

    return render(<SplitButtonMenu {...props} />);
};

describe('SplitButtonMenu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the selected item label', () => {
        setup();
        expect(screen.getByRole('button', { name: 'Add to List 2' })).toBeInTheDocument();
    });

    it('should call onClick when the primary button is clicked', async () => {
        setup();
        await userEvent.click(screen.getByRole('button', { name: 'Add to List 2' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should disable the primary button', () => {
        setup({ disabled: true });

        expect(screen.getByRole('button', { name: 'Add to List 2' })).toBeDisabled();
    });

    it('should open and close the menu', async () => {
        setup();

        const toggleButton = screen.getAllByRole('button')[1];
        await userEvent.click(toggleButton);

        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getByText('List 1')).toBeInTheDocument();
        expect(screen.getByText('List 2')).toBeInTheDocument();
        expect(screen.getByText('List 3')).toBeInTheDocument();

        await userEvent.click(toggleButton);
        await waitFor(() => {
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
    });

    it('should call onItemSelect and close the menu when an item is selected', async () => {
        setup();

        await userEvent.click(screen.getAllByRole('button')[1]);
        await userEvent.click(screen.getByText('List 3'));

        expect(onItemSelect).toHaveBeenCalledWith(2);
        await waitFor(() => {
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
    });

    it('should render the settings option when onSettings is provided', async () => {
        setup();

        await userEvent.click(screen.getAllByRole('button')[1]);

        expect(screen.getByText('Manage lists')).toBeInTheDocument();
    });

    it('should not render the settings option when onSettings is not provided', async () => {
        setup({ onSettings: undefined });

        await userEvent.click(screen.getAllByRole('button')[1]);

        expect(screen.queryByText('Manage lists')).not.toBeInTheDocument();
    });

    it('should call onSettings and close the menu', async () => {
        setup();

        await userEvent.click(screen.getAllByRole('button')[1]);
        await userEvent.click(screen.getByText('Manage lists'));

        expect(onSettings).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
    });

    it('should show a loading indicator', () => {
        setup({ loading: true });

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render an empty label when no item is selected', () => {
        setup({
            selectedIndex: -1,
        });

        expect(screen.getAllByRole('button')[0]).toHaveTextContent('');
    });

    it('should mark the selected menu item', async () => {
        setup({
            selectedIndex: 2,
        });

        await userEvent.click(screen.getAllByRole('button')[1]);
        expect(screen.getByText('List 3').closest('.MuiMenuItem-root')).toHaveClass('Mui-selected');
    });

    it('should close the menu when clicking outside', async () => {
        setup();

        await userEvent.click(screen.getAllByRole('button')[1]);
        expect(screen.getByRole('menu')).toBeInTheDocument();

        await userEvent.click(document.body);

        await waitFor(() => {
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
    });
});
