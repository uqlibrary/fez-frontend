import React from 'react';
import { render, screen, userEvent, waitFor } from 'test-utils';
import ListSplitButtonMenu from './ListSplitButtonMenu';

const onClick = jest.fn();
const onItemSelect = jest.fn();
const onAdd = jest.fn();
const onOpenChange = jest.fn();

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
        onAdd,
        label: item => `Add to ${item.label}`,
        ...testProps,
    };

    return render(<ListSplitButtonMenu {...props} />);
};

// wraps the menu with an external element for exercising clickAwayExcludeRef
const setupWithExcludedElement = (testProps = {}) => {
    const ExcludeWrapper = () => {
        const excludeRef = React.useRef(null);
        return (
            <>
                <ListSplitButtonMenu
                    items={items}
                    selectedIndex={1}
                    onClick={onClick}
                    onItemSelect={onItemSelect}
                    onAdd={onAdd}
                    label={item => `Add to ${item.label}`}
                    clickAwayExcludeRef={excludeRef}
                    {...testProps}
                />
                <div ref={excludeRef} data-testid="excluded-el">
                    excluded content
                </div>
            </>
        );
    };
    return render(<ExcludeWrapper />);
};

describe('ListSplitButtonMenu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the selected item label', () => {
        setup();
        expect(screen.getByRole('button', { name: 'Add to List 2' })).toBeInTheDocument();
    });

    it('should render an empty label when no item is selected', () => {
        setup({ selectedIndex: -1 });
        expect(screen.getAllByRole('button')[0]).toHaveTextContent('');
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

    it('should show a loading indicator', () => {
        setup({ loading: true });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    describe('uncontrolled open state', () => {
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

        it('should update the toggle aria-label based on open state', async () => {
            setup();
            const toggleButton = screen.getAllByRole('button')[1];
            expect(toggleButton).toHaveAccessibleName('Open list options');

            await userEvent.click(toggleButton);
            expect(toggleButton).toHaveAccessibleName('Close list options');
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

        it('should mark the selected menu item', async () => {
            setup({ selectedIndex: 2 });
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

    describe('add option', () => {
        it('should render the add option when onAdd is provided', async () => {
            setup();
            await userEvent.click(screen.getAllByRole('button')[1]);

            expect(screen.getByText('Add new')).toBeInTheDocument();
        });

        it('should not render the add option when onAdd is not provided', async () => {
            setup({ onAdd: undefined });
            await userEvent.click(screen.getAllByRole('button')[1]);

            expect(screen.queryByText('Add new')).not.toBeInTheDocument();
        });

        it('should call onAdd without closing the menu when Add new is clicked', async () => {
            setup();
            await userEvent.click(screen.getAllByRole('button')[1]);
            await userEvent.click(screen.getByText('Add new'));

            expect(onAdd).toHaveBeenCalledTimes(1);
            expect(screen.getByRole('menu')).toBeInTheDocument();
        });
    });

    describe('controlled open state', () => {
        it('should render open when open prop is true regardless of internal state', () => {
            setup({ open: true, onOpenChange });
            expect(screen.getByRole('menu')).toBeInTheDocument();
        });

        it('should render closed when open prop is false', () => {
            setup({ open: false, onOpenChange });
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });

        it('should call onOpenChange instead of managing state internally on toggle', async () => {
            setup({ open: true, onOpenChange });
            await userEvent.click(screen.getAllByRole('button')[1]);

            expect(onOpenChange).toHaveBeenCalledWith(false);
            // parent hasn't re-rendered with the new value yet, so it stays open
            expect(screen.getByRole('menu')).toBeInTheDocument();
        });

        it('should call onOpenChange on item selection', async () => {
            setup({ open: true, onOpenChange });
            await userEvent.click(screen.getByText('List 3'));

            expect(onItemSelect).toHaveBeenCalledWith(2);
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });

        it('should call onOpenChange when clicking away', async () => {
            setup({ open: true, onOpenChange });
            await userEvent.click(document.body);

            await waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(false);
            });
        });
    });

    describe('clickAwayExcludeRef', () => {
        it('should not close the menu when clicking the excluded element', async () => {
            setupWithExcludedElement({ open: true, onOpenChange });
            await userEvent.click(screen.getByTestId('excluded-el'));

            expect(onOpenChange).not.toHaveBeenCalled();
            expect(screen.getByRole('menu')).toBeInTheDocument();
        });

        it('should still close on click away when target is outside both the anchor and the excluded ref', async () => {
            setupWithExcludedElement({ open: true, onOpenChange });
            await userEvent.click(document.body);

            await waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(false);
            });
        });
    });
});
