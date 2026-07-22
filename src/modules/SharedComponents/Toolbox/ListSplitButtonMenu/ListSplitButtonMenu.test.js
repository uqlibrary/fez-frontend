import React from 'react';
import { assertDisabled, assertEnabled, render, userEvent, waitFor } from 'test-utils';
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
        const { getByRole } = setup();
        expect(getByRole('button', { name: 'Add to List 2' })).toBeInTheDocument();
    });

    it('should render an empty label when no item is selected', () => {
        const { getAllByRole } = setup({ selectedIndex: -1 });
        expect(getAllByRole('button')[0]).toHaveTextContent('');
    });

    it('should render given placeholder when no item is selected', () => {
        const placeholder = 'Select a list';
        const { getAllByRole } = setup({ items: [], placeholder });
        expect(getAllByRole('button')[0]).toHaveTextContent(placeholder);
    });

    it('should call onClick when the primary button is clicked', async () => {
        const { getByRole } = setup();
        await userEvent.click(getByRole('button', { name: 'Add to List 2' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should disable the primary button', () => {
        const { getByRole } = setup({ disabled: true });
        expect(getByRole('button', { name: 'Add to List 2' })).toBeDisabled();
    });

    it('should show a loading indicator', () => {
        const { getByRole, getAllByRole } = setup({ loading: true });
        expect(getByRole('progressbar')).toBeInTheDocument();
        getAllByRole('button').map(assertDisabled);
    });

    it('should show as disabled on error', () => {
        const { getByRole, getAllByRole } = setup({ error: true });
        expect(getByRole('group')).toHaveClass('MuiButtonGroup-colorError');
        assertDisabled(getAllByRole('button')[0]);
        assertEnabled(getAllByRole('button')[1]);
    });

    describe('uncontrolled open state', () => {
        it('should open and close the menu', async () => {
            const { getAllByRole, getByText, queryAllByRole } = setup();
            const toggleButton = getAllByRole('button')[1];

            await userEvent.click(toggleButton);
            expect(getAllByRole('menu').length).toBeGreaterThan(0);
            expect(getByText('List 1')).toBeInTheDocument();
            expect(getByText('List 2')).toBeInTheDocument();
            expect(getByText('List 3')).toBeInTheDocument();

            await userEvent.click(toggleButton);
            await waitFor(() => {
                expect(queryAllByRole('menu')).toHaveLength(0);
            });
        });

        it('should update the toggle aria-label based on open state', async () => {
            const { getAllByRole } = setup();
            const toggleButton = getAllByRole('button')[1];
            expect(toggleButton).toHaveAccessibleName('Open list options');

            await userEvent.click(toggleButton);
            expect(toggleButton).toHaveAccessibleName('Close list options');
        });

        it('should call onItemSelect and close the menu when an item is selected', async () => {
            const { getAllByRole, getByText, queryAllByRole } = setup();
            await userEvent.click(getAllByRole('button')[1]);
            await userEvent.click(getByText('List 3'));

            expect(onItemSelect).toHaveBeenCalledWith(2);
            await waitFor(() => {
                expect(queryAllByRole('menu')).toHaveLength(0);
            });
        });

        it('should mark the selected menu item', async () => {
            const { getAllByRole, getByText } = setup({ selectedIndex: 2 });
            await userEvent.click(getAllByRole('button')[1]);

            expect(getByText('List 3').closest('.MuiMenuItem-root')).toHaveClass('Mui-selected');
        });

        it('should close the menu when clicking outside', async () => {
            const { getAllByRole, queryAllByRole } = setup();
            await userEvent.click(getAllByRole('button')[1]);
            expect(getAllByRole('menu').length).toBeGreaterThan(0);

            await userEvent.click(document.body);
            await waitFor(() => {
                expect(queryAllByRole('menu')).toHaveLength(0);
            });
        });
    });

    describe('add option', () => {
        it('should render the add option when onAdd is provided', async () => {
            const { getAllByRole, getByText } = setup();
            await userEvent.click(getAllByRole('button')[1]);

            expect(getByText('Add new')).toBeInTheDocument();
        });

        it('should not render the add option when onAdd is not provided', async () => {
            const { getAllByRole, queryByText } = setup({ onAdd: undefined });
            await userEvent.click(getAllByRole('button')[1]);

            expect(queryByText('Add new')).not.toBeInTheDocument();
        });

        it('should call onAdd without closing the menu when Add new is clicked', async () => {
            const { getAllByRole, getByText } = setup();
            await userEvent.click(getAllByRole('button')[1]);
            await userEvent.click(getByText('Add new'));

            expect(onAdd).toHaveBeenCalledTimes(1);
            expect(getAllByRole('menu').length).toBeGreaterThan(0);
        });
    });

    describe('controlled open state', () => {
        it('should render open when open prop is true regardless of internal state', () => {
            const { getAllByRole } = setup({ open: true, onOpenChange });
            expect(getAllByRole('menu').length).toBeGreaterThan(0);
        });

        it('should render closed when open prop is false', () => {
            const { queryAllByRole } = setup({ open: false, onOpenChange });
            expect(queryAllByRole('menu')).toHaveLength(0);
        });

        it('should call onOpenChange instead of managing state internally on toggle', async () => {
            const { getAllByRole } = setup({ open: true, onOpenChange });
            await userEvent.click(getAllByRole('button')[1]);

            expect(onOpenChange).toHaveBeenCalledWith(false);
            // parent hasn't re-rendered with the new value yet, so it stays open
            expect(getAllByRole('menu').length).toBeGreaterThan(0);
        });

        it('should call onOpenChange on item selection', async () => {
            const { getByText } = setup({ open: true, onOpenChange });
            await userEvent.click(getByText('List 3'));

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
            const { getAllByRole, getByTestId } = setupWithExcludedElement({ open: true, onOpenChange });
            await userEvent.click(getByTestId('excluded-el'));

            expect(onOpenChange).not.toHaveBeenCalled();
            expect(getAllByRole('menu').length).toBeGreaterThan(0);
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
