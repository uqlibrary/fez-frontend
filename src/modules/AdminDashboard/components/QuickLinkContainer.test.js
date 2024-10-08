import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, waitFor, waitForElementToBeRemoved, userEvent } from 'test-utils';
import QuickLinkContainer from './QuickLinkContainer';

import * as DashboardActions from 'actions/adminDashboard';
import * as General from 'config/general';

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
        <WithReduxStore initialState={Immutable.Map(state)}>
            <QuickLinkContainer {...testProps} />
        </WithReduxStore>,
    );
};

describe('QuickLinkContainer', () => {
    const oldVal = General.IS_PRODUCTION;
    beforeAll(() => {
        General.IS_PRODUCTION = true;
    });
    afterAll(() => {
        General.IS_PRODUCTION = oldVal;
    });

    beforeEach(() => {
        mockApi = setupMockAdapter();
        mockApi.onAny().reply(200, {});
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render loader', () => {
        const { getByText, getAllByTestId, getByRole } = setup();

        expect(getByText('Quick Links')).toBeInTheDocument();
        expect(getByRole('progressbar')).toBeInTheDocument();
        expect(getAllByTestId('admin-dashboard-quicklinks-skeleton').length).toBe(8);
    });

    it('should render no quick links, show the add button', async () => {
        const { getByText, getByTestId, getByRole } = setup();
        expect(getByText('Quick Links')).toBeInTheDocument();
        await waitForElementToBeRemoved(() => getByRole('progressbar'));
        expect(getByTestId('add-quick-link')).toBeInTheDocument();
    });

    it('should render "empty list" message', async () => {
        const { getByText, getByTestId } = setup(
            {},
            { adminDashboardQuickLinksReducer: { adminDashboardQuickLinksSuccess: true } },
        );
        expect(getByText('Add your first quick link using the "add" button')).toBeInTheDocument();
        expect(getByTestId('add-quick-link')).toBeInTheDocument();
    });

    it('should render list of quick links', async () => {
        const { getByText, getByTestId, container } = setup(
            {},
            {
                adminDashboardQuickLinksReducer: {
                    adminDashboardQuickLinksData: listData,
                    adminDashboardQuickLinksSuccess: true,
                },
            },
        );

        await waitFor(() => getByTestId('quick-link-0-link'));
        expect(getByText('Quick Links')).toBeInTheDocument();
        expect(getByTestId('add-quick-link')).toBeInTheDocument();
        expect(container.querySelectorAll('[data-testid^=quick-link-item-]').length).toBe(3);
    });

    it('should show the admin interface for ADD and fire expected events', async () => {
        const adminDashboardQuickLinkFn = jest.spyOn(DashboardActions, 'adminDashboardQuickLink');
        const loadAdminDashboardQuickLinksFn = jest.spyOn(DashboardActions, 'loadAdminDashboardQuickLinks');

        const { getByText, getByTestId, getByRole } = setup();
        expect(getByText('Quick Links')).toBeInTheDocument();
        await waitForElementToBeRemoved(() => getByRole('progressbar'));
        userEvent.click(getByTestId('add-quick-link'));
        await waitFor(() => getByTestId('quicklinks-admin-form'));
        expect(getByText('Add new quick link')).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Save' }));
        expect(adminDashboardQuickLinkFn).not.toHaveBeenCalled();

        await userEvent.type(getByTestId('qlk_title-input'), 'Test title');
        await userEvent.type(getByTestId('qlk_link-input'), 'Test link');

        await userEvent.click(getByRole('button', { name: 'Save' }));
        expect(adminDashboardQuickLinkFn).toHaveBeenCalledWith(
            {
                qlk_link: 'Test link',
                qlk_title: 'Test title',
            },
            'ADD',
        );
        await waitFor(() => expect(loadAdminDashboardQuickLinksFn).toHaveBeenCalled());
        await waitFor(() => getByRole('progressbar'));
    });

    it('should show the admin interface for EDIT and fire expected events', async () => {
        const adminDashboardQuickLinkFn = jest.spyOn(DashboardActions, 'adminDashboardQuickLink');
        const loadAdminDashboardQuickLinksFn = jest.spyOn(DashboardActions, 'loadAdminDashboardQuickLinks');

        const { getByRole, findByRole, getByTestId, getByText } = setup(
            {},
            {
                adminDashboardQuickLinksReducer: {
                    adminDashboardQuickLinksData: listData,
                    adminDashboardQuickLinksSuccess: true,
                },
            },
        );

        await waitFor(() => getByTestId('quick-link-1-link'));
        userEvent.click(getByTestId('admin-actions-button-1'));
        await findByRole('presentation');
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));

        await waitFor(() => getByTestId('quicklinks-admin-form'));

        expect(getByText('Edit')).toBeInTheDocument();

        await userEvent.type(getByTestId('qlk_title-input'), ' Updated');
        await userEvent.type(getByTestId('qlk_link-input'), ' Updated');

        await userEvent.click(getByRole('button', { name: 'Save' }));
        expect(adminDashboardQuickLinkFn).toHaveBeenCalledWith(
            {
                qlk_id: 2,
                qlk_link: 'https://espace.library.uq.edu.au/records/search Updated',
                qlk_title: 'Link 2 Updated',
            },
            'EDIT',
        );
        await waitFor(() => expect(loadAdminDashboardQuickLinksFn).toHaveBeenCalled());
        await waitFor(() => getByRole('progressbar'));
    });

    it('should show the admin interface for DELETE and fire expected events', async () => {
        const adminDashboardQuickLinkFn = jest.spyOn(DashboardActions, 'adminDashboardQuickLink');
        const loadAdminDashboardQuickLinksFn = jest.spyOn(DashboardActions, 'loadAdminDashboardQuickLinks');

        const { getByRole, findByRole, getByTestId, getByText } = setup(
            {},
            {
                adminDashboardQuickLinksReducer: {
                    adminDashboardQuickLinksData: listData,
                    adminDashboardQuickLinksSuccess: true,
                },
            },
        );
        await waitFor(() => getByTestId('quick-link-1-link'));
        userEvent.click(getByTestId('admin-actions-button-1'));
        await findByRole('presentation');
        await userEvent.click(getByRole('menuitem', { name: 'Delete' }));

        await waitFor(() => getByTestId('quicklinks-admin-form'));
        expect(getByText('DELETE')).toBeInTheDocument();
        expect(getByTestId('qlk_title-input')).toHaveAttribute('disabled');
        expect(getByTestId('qlk_link-input')).toHaveAttribute('disabled');

        await userEvent.click(getByRole('button', { name: 'Delete' }));
        expect(adminDashboardQuickLinkFn).toHaveBeenCalledWith(
            {
                qlk_id: 2,
                qlk_link: 'https://espace.library.uq.edu.au/records/search',
                qlk_title: 'Link 2',
            },
            'DELETE',
        );
        expect(getByRole('button', { name: 'Deleting...' })).toBeInTheDocument();
        await waitFor(() => expect(loadAdminDashboardQuickLinksFn).toHaveBeenCalled());

        await waitFor(() => getByRole('progressbar'));
    });

    it('should show the admin interface and react to Cancel button click', async () => {
        const { getByText, getByTestId, getByRole, queryByTestId } = setup();
        expect(getByText('Quick Links')).toBeInTheDocument();
        await waitForElementToBeRemoved(() => getByRole('progressbar'));
        userEvent.click(getByTestId('add-quick-link'));
        await waitFor(() => getByTestId('quicklinks-admin-form'));
        expect(getByText('Add new quick link')).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Cancel' }));
        expect(queryByTestId('quicklinks-admin-form')).not.toBeInTheDocument();
    });

    it('should handle reordering', async () => {
        const adminDashboardQuickLinkFn = jest.spyOn(DashboardActions, 'adminDashboardQuickLink');

        const { getByRole, findByRole, getByTestId } = setup(
            {},
            {
                adminDashboardQuickLinksReducer: {
                    adminDashboardQuickLinksData: listData,
                    adminDashboardQuickLinksSuccess: true,
                },
            },
        );
        await waitFor(() => getByTestId('quick-link-1-link'));

        userEvent.click(getByTestId('admin-actions-button-1'));
        await findByRole('presentation');

        expect(getByTestId('quick-link-0-link')).toHaveTextContent('Link 1');
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Link 2');
        expect(getByTestId('quick-link-2-link')).toHaveTextContent('Link 3');

        // MOVE UP

        const moveUpExpected = [
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
        expect(adminDashboardQuickLinkFn).toHaveBeenCalledWith(moveUpExpected, 'REORDER');

        expect(getByTestId('quick-link-0-link')).toHaveTextContent('Link 2');
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Link 1');
        expect(getByTestId('quick-link-2-link')).toHaveTextContent('Link 3');

        // MOVE DOWN
        const moveDownExpected = [
            {
                qlk_id: 2,
                qlk_order: 0,
            },
            {
                qlk_id: 3,
                qlk_order: 1,
            },
            {
                qlk_id: 1,
                qlk_order: 2,
            },
        ];

        userEvent.click(getByTestId('admin-actions-button-1'));
        await findByRole('presentation');

        await userEvent.click(getByRole('menuitem', { name: 'Move down' }));
        expect(adminDashboardQuickLinkFn).toHaveBeenLastCalledWith(moveDownExpected, 'REORDER');

        expect(getByTestId('quick-link-0-link')).toHaveTextContent('Link 2');
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Link 3');
        expect(getByTestId('quick-link-2-link')).toHaveTextContent('Link 1');

        // MOVE TO TOP
        const moveTopExpected = [
            {
                qlk_id: 3,
                qlk_order: 0,
            },
            {
                qlk_id: 2,
                qlk_order: 1,
            },
            {
                qlk_id: 1,
                qlk_order: 2,
            },
        ];

        userEvent.click(getByTestId('admin-actions-button-1'));
        await findByRole('presentation');

        await userEvent.click(getByRole('menuitem', { name: 'Move to top' }));
        expect(adminDashboardQuickLinkFn).toHaveBeenLastCalledWith(moveTopExpected, 'REORDER');
        expect(getByTestId('quick-link-0-link')).toHaveTextContent('Link 3');
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Link 2');
        expect(getByTestId('quick-link-2-link')).toHaveTextContent('Link 1');

        // MOVE TO BOTTOM
        const moveBottomExpected = [
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

        userEvent.click(getByTestId('admin-actions-button-0'));
        await findByRole('presentation');

        await userEvent.click(getByRole('menuitem', { name: 'Move to bottom' }));
        expect(adminDashboardQuickLinkFn).toHaveBeenLastCalledWith(moveBottomExpected, 'REORDER');
        expect(getByTestId('quick-link-0-link')).toHaveTextContent('Link 2');
        expect(getByTestId('quick-link-1-link')).toHaveTextContent('Link 1');
        expect(getByTestId('quick-link-2-link')).toHaveTextContent('Link 3');
    });
});
