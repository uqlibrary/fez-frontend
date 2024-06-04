import React from 'react';

import { render, userEvent, act } from 'test-utils';
import QuickLink from './QuickLink';

const locale = {
    menu: {
        editLabel: 'Edit',
        deleteLabel: 'Delete',
        moveUpLabel: 'Move up',
        moveTopLabel: 'Move to top',
        moveDownLabel: 'Move down',
        moveBottomLabel: 'Move to bottom',
    },
};
const linkInternal = {
    qlk_id: 1,
    qlk_amount: 100,
    qlk_order: 1,
    qlk_title: 'Test internal title',
    qlk_link: 'https://espace.library.uq.edu.au',
};
const linkExternal = {
    qlk_id: 1,
    qlk_amount: null,
    qlk_order: 1,
    qlk_title: 'Test external title',
    qlk_link: 'https://www.library.uq.edu.au',
};

const assertMenuItems = (getByText, assertItemLabels, state) => {
    assertItemLabels.forEach(label => {
        state === 'enabled'
            ? expect(getByText(label).closest('li')).not.toHaveClass('Mui-disabled')
            : expect(getByText(label).closest('li')).toHaveClass('Mui-disabled');
    });
};

const setup = (props = {}, renderer = render) => {
    const testProps = {
        locale,
        onMenuItemClick: jest.fn(),
        ...props,
    };
    return renderer(<QuickLink {...testProps} />);
};

describe('QuickLink', () => {
    it('should render internal link as expected', async () => {
        const { getByTestId, queryByTestId, getByText } = setup({
            link: linkInternal,
            index: 1,
            itemCount: 1,
            'data-testid': 'test-id',
        });

        expect(getByTestId('test-id')).toBeInTheDocument();
        expect(getByText('100')).toBeInTheDocument();
        expect(queryByTestId('OpenInNewIcon')).not.toBeInTheDocument();
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Test internal title');
        expect(getByTestId('MoreVertIcon')).toBeInTheDocument();
    });

    it('should render external link as expected', async () => {
        const { getByTestId, queryByText } = setup({
            link: linkExternal,
            index: 1,
            itemCount: 1,
            'data-testid': 'test-id',
        });

        expect(getByTestId('test-id')).toBeInTheDocument();
        expect(queryByText('100')).not.toBeInTheDocument();
        expect(getByTestId('OpenInNewIcon')).toBeInTheDocument();
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Test external title');
        expect(getByTestId('MoreVertIcon')).toBeInTheDocument();
    });

    it('should render menu when action button clicked, with enabled menu items when only item in list', async () => {
        const { getByText, getByTestId, findByRole, getAllByRole } = setup({
            link: linkInternal,
            index: 0,
            itemCount: 1,
            'data-testid': 'test-id',
        });

        userEvent.click(getByTestId('MoreVertIcon').closest('button'));
        await findByRole('presentation');
        const menuitems = getAllByRole('menuitem');
        expect(menuitems.length).toBe(6);

        assertMenuItems(getByText, ['Edit', 'Delete'], 'enabled');
        assertMenuItems(getByText, ['Move up', 'Move to top', 'Move down', 'Move to bottom'], 'disabled');
        const disabledItems = menuitems.filter(item => item.className.includes('Mui-disabled')).length;
        expect(disabledItems).toBe(4);
    });

    it('should render menu when action button clicked, with enabled menu items for first item in list', async () => {
        const { getByText, getByTestId, findByRole, getAllByRole } = setup({
            link: linkInternal,
            index: 0,
            itemCount: 3,
            'data-testid': 'test-id',
        });

        userEvent.click(getByTestId('MoreVertIcon').closest('button'));
        await findByRole('presentation');
        const menuitems = getAllByRole('menuitem');
        expect(menuitems.length).toBe(6);

        assertMenuItems(getByText, ['Edit', 'Delete', 'Move down', 'Move to bottom'], 'enabled');
        assertMenuItems(getByText, ['Move up', 'Move to top'], 'disabled');
    });

    it('should render menu when action button clicked, with enabled menu items for middle item in list', async () => {
        const { getByText, getByTestId, findByRole, getAllByRole } = setup({
            link: linkInternal,
            index: 1,
            itemCount: 3,
            'data-testid': 'test-id',
        });

        userEvent.click(getByTestId('MoreVertIcon').closest('button'));
        await findByRole('presentation');
        const menuitems = getAllByRole('menuitem');
        expect(menuitems.length).toBe(6);

        assertMenuItems(
            getByText,
            ['Edit', 'Delete', 'Move down', 'Move to bottom', 'Move up', 'Move to top'],
            'enabled',
        );
    });

    it('should render menu when action button clicked, with enabled menu items for last item in list', async () => {
        const { getByText, getByTestId, findByRole, getAllByRole } = setup({
            link: linkInternal,
            index: 2,
            itemCount: 3,
            'data-testid': 'test-id',
        });

        userEvent.click(getByTestId('MoreVertIcon').closest('button'));
        await findByRole('presentation');
        const menuitems = getAllByRole('menuitem');
        expect(menuitems.length).toBe(6);

        assertMenuItems(getByText, ['Edit', 'Delete', 'Move up', 'Move to top'], 'enabled');
        assertMenuItems(getByText, ['Move down', 'Move to bottom'], 'disabled');
    });

    it('should should call function when menu item clicked', async () => {
        const testFn = jest.fn();
        const { getByText, getByTestId, findByRole } = setup({
            link: linkInternal,
            index: 1,
            itemCount: 3,
            onMenuItemClick: testFn,
            'data-testid': 'test-id',
        });
        const openMenu = async () => {
            const menuButton = getByTestId('MoreVertIcon').closest('button');
            act(() => {
                userEvent.click(menuButton);
            });
            await findByRole('presentation');
        };

        await openMenu();

        await userEvent.click(getByText('Edit'));
        expect(testFn).toHaveBeenCalledWith('EDIT');

        await openMenu();
        await userEvent.click(getByText('Delete'));
        expect(testFn).toHaveBeenLastCalledWith('DELETE');

        await openMenu();
        await userEvent.click(getByText('Move up'));
        expect(testFn).toHaveBeenCalledWith('MOVEUP');

        await openMenu();
        await userEvent.click(getByText('Move down'));
        expect(testFn).toHaveBeenLastCalledWith('MOVEDOWN');

        await openMenu();
        await userEvent.click(getByText('Move to top'));
        expect(testFn).toHaveBeenCalledWith('MOVETOP');

        await openMenu();
        await userEvent.click(getByText('Move to bottom'));
        expect(testFn).toHaveBeenLastCalledWith('MOVEBOTTOM');
    });
});
