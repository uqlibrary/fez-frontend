import React from 'react';
import { render, WithReduxStore, waitFor, userEvent } from 'test-utils';
import QuickLinkContainer from './QuickLinkContainer';
import * as DashboardActions from 'actions/adminDashboard';

const locale = {
    title: 'Quick Links ',
    addLinkText: '+ add',
    loading: {
        message: 'Loading quick links...',
        nodata: 'Add your first quick link using the "add" button',
    },
    link: {
        menu: {
            editLabel: 'Edit',
            deleteLabel: 'Delete',
            moveUpLabel: 'Move up',
            moveTopLabel: 'Move to top',
            moveDownLabel: 'Move down',
            moveBottomLabel: 'Move to bottom',
        },
    },
    admin: {
        add: {
            title: 'Add new quick link',
        },
        edit: {
            title: 'Edit ',
        },
        delete: {
            title: 'DELETE ',
        },
        button: {
            delete: 'Delete',
            save: 'Save',
            deleteBusy: 'Deleting...',
            saveBusy: 'Saving...',
            cancel: 'Cancel',
        },
        fields: {
            title: 'Title',
            link: 'Link',
        },
    },
    error: {
        title: 'Error',
        updating: 'An error occurred updating the quick link data.',
    },
};
const listData = [
    {
        qlk_id: 1,
        qlk_amount: 10,
        qlk_order: 1,
        qlk_title: 'Link 1',
        qlk_link: 'https://espace.library.uq.edu.au/records/search',
    },
    { qlk_id: 3, qlk_amount: null, qlk_order: 3, qlk_title: 'Link 3', qlk_link: 'https://www.library.uq.edu.au' },
    {
        qlk_id: 2,
        qlk_amount: 30,
        qlk_order: 2,
        qlk_title: 'Link 2',
        qlk_link: 'https://espace.library.uq.edu.au/records/search',
    },
];

const setup = (props = {}, state = {}, renderer = render) => {
    const testProps = {
        locale,
        initialViewProps: {},
        ...props,
    };
    return renderer(
        <WithReduxStore initialState={state}>
            <QuickLinkContainer {...testProps} />
        </WithReduxStore>,
    );
};

describe('QuickLinkContainer reordering error', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();

        mockApi.onGet().reply(200, { data: listData });
        mockApi.onPut().reply(422, {});
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should handle reordering error', async () => {
        const adminDashboardQuickLinkFn = jest.spyOn(DashboardActions, 'adminDashboardQuickLink');
        const loadAdminDashboardQuickLinksFn = jest.spyOn(DashboardActions, 'loadAdminDashboardQuickLinks');

        const { getByText, getByRole, findByRole, getByTestId } = setup({});
        expect(getByText('Quick Links')).toBeInTheDocument();

        await waitFor(() => getByTestId('quick-link-1-link'));

        await userEvent.click(getByTestId('admin-actions-button-1'));
        await findByRole('presentation');

        expect(getByTestId('quick-link-0-link')).toHaveTextContent('Link 1');
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Link 2');
        expect(getByTestId('quick-link-2-link')).toHaveTextContent('Link 3');

        const expected = [
            {
                qlk_id: 2,
                qlk_order: 0,
            },
            {
                qlk_id: 1,
                qlk_order: 1,
            },
            {
                qlk_id: 3,
                qlk_order: 2,
            },
        ];

        await userEvent.click(getByRole('menuitem', { name: 'Move up' }));
        expect(adminDashboardQuickLinkFn).toHaveBeenLastCalledWith(expected, 'REORDER');

        expect(getByTestId('quick-link-0-link')).toHaveTextContent('Link 2');
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Link 1');
        expect(getByTestId('quick-link-2-link')).toHaveTextContent('Link 3');

        // on failure to update, the API should be pinged for the current
        // quicklink list to ensure the UI is in sync
        await waitFor(() => expect(loadAdminDashboardQuickLinksFn).toHaveBeenCalledTimes(3));
    });
});
