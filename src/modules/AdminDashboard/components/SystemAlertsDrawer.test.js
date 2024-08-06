import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, waitFor, within } from 'test-utils';
import SystemAlertsDrawer from './SystemAlertsDrawer';
import userEvent from '@testing-library/user-event';

import { SYSTEM_ALERT_ACTION, getFormattedServerDate } from '../config';

const locale = {
    alertStatus: {
        UNASSIGNED: 'Unassigned',
    },
    drawer: {
        markResolved: 'Mark as resolved',
        updating: 'Updating...',
        alertId: 'Alert ID',
        received: 'Received',
        status: 'Status',
        statusHelpText: 'Assign a staff member to this issue',
    },
};

const testRowUnassigned = {
    sat_assigned_date: null,
    sat_content: 'Test unassigned content',
    sat_created_date: '2024-04-03 15:55:00',
    sat_id: 1,
    sat_link: 'https://espace.library.uq.edu.au',
    sat_title: 'Test unassigned title',
};
const testRowAssigned = {
    sat_assigned_date: null,
    sat_assigned_to: 13,
    sat_content: 'Test assigned content',
    sat_created_date: '2024-04-03 15:55:00',
    sat_id: 12,
    sat_link: 'https://espace.library.uq.edu.au',
    sat_title: 'Test assigned title',
};

const setup = (props = {}, state = {}, renderer = render) => {
    const testProps = {
        locale,
        ...props,
    };
    const testState = {
        adminDashboardConfigReducer: {
            adminDashboardConfigData: {
                admin_users: [{ id: 13, name: 'Staff' }],
            },
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(testState)}>
            <SystemAlertsDrawer {...testProps} />
        </WithReduxStore>,
    );
};

describe('SystemAlertsDrawer', () => {
    const onCloseDrawerFn = jest.fn();
    const onSystemAlertUpdateFn = jest.fn();

    it('should render empty drawer', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('system-alert-detail')).not.toBeInTheDocument();
    });

    it('should render closed drawer', () => {
        const { queryByTestId } = setup({
            row: testRowUnassigned,
            open: false,
            onCloseDrawer: onCloseDrawerFn,
            onSystemAlertUpdate: onSystemAlertUpdateFn,
        });

        expect(queryByTestId('system-alert-detail')).not.toBeInTheDocument();
    });

    it('should render drawer for unassigned alert', () => {
        const { getByTestId, queryByTestId } = setup({
            row: testRowUnassigned,
            open: true,
            onCloseDrawer: onCloseDrawerFn,
            onSystemAlertUpdate: onSystemAlertUpdateFn,
        });

        expect(getByTestId('system-alert-detail')).toBeInTheDocument();
        expect(getByTestId('system-alert-detail-title')).toHaveTextContent(testRowUnassigned.sat_title);
        expect(getByTestId('system-alert-detail-link')).toHaveTextContent(testRowUnassigned.sat_link);
        expect(getByTestId('system-alert-detail-id')).toHaveTextContent(testRowUnassigned.sat_id);
        expect(getByTestId('system-alert-detail-date-created')).toHaveTextContent(
            getFormattedServerDate(testRowUnassigned.sat_created_date, true),
        );
        expect(getByTestId('system-alert-detail-description')).toHaveTextContent(testRowUnassigned.sat_content);
        expect(getByTestId('system-alert-detail-assignee-input')).toHaveValue(locale.alertStatus.UNASSIGNED);
        expect(queryByTestId('system-alert-detail-action-button')).not.toBeInTheDocument();
    });

    it('should call function when assignee is changed', async () => {
        const { getByTestId, getByRole, rerender } = setup({
            row: testRowUnassigned,
            open: true,
            onCloseDrawer: onCloseDrawerFn,
            onSystemAlertUpdate: onSystemAlertUpdateFn,
        });

        await userEvent.click(getByTestId('system-alert-detail-assignee-input'));
        await waitFor(() => expect(getByRole('listbox')));
        await userEvent.click(getByRole('option', { name: 'Staff' }));
        expect(onSystemAlertUpdateFn).toHaveBeenCalledWith(SYSTEM_ALERT_ACTION.ASSIGN, {
            sat_id: 1,
            sat_assigned_to: 13,
        });
        setup(
            {
                row: testRowUnassigned,
                open: true,
                onCloseDrawer: onCloseDrawerFn,
                onSystemAlertUpdate: onSystemAlertUpdateFn,
            },
            { adminDashboardSystemAlertsReducer: { adminDashboardSystemAlertsUpdating: true } },
            rerender,
        );

        expect(getByTestId('system-alert-detail-assignee-input')).toHaveAttribute('disabled');
        expect(within(getByTestId('system-alert-detail-assignee')).getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render drawer for assigned alert', () => {
        const { getByTestId } = setup({
            row: testRowAssigned,
            open: true,
            onCloseDrawer: onCloseDrawerFn,
            onSystemAlertUpdate: onSystemAlertUpdateFn,
        });

        expect(getByTestId('system-alert-detail')).toBeInTheDocument();
        expect(getByTestId('system-alert-detail-title')).toHaveTextContent(testRowAssigned.sat_title);
        expect(getByTestId('system-alert-detail-link')).toHaveTextContent(testRowAssigned.sat_link);
        expect(getByTestId('system-alert-detail-id')).toHaveTextContent(testRowAssigned.sat_id);
        expect(getByTestId('system-alert-detail-date-created')).toHaveTextContent(
            getFormattedServerDate(testRowAssigned.sat_created_date, true),
        );
        expect(getByTestId('system-alert-detail-description')).toHaveTextContent(testRowAssigned.sat_content);
        expect(getByTestId('system-alert-detail-assignee-input')).toHaveValue('Staff');
        expect(getByTestId('system-alert-detail-action-button')).toBeInTheDocument();
    });

    it('should call function when alert is resolved', async () => {
        const { getByRole, queryByRole, rerender } = setup({
            row: testRowAssigned,
            open: true,
            onCloseDrawer: onCloseDrawerFn,
            onSystemAlertUpdate: onSystemAlertUpdateFn,
        });

        expect(getByRole('button', { name: locale.drawer.markResolved })).toBeInTheDocument();
        await userEvent.click(getByRole('button', { name: locale.drawer.markResolved }));
        expect(onSystemAlertUpdateFn).toHaveBeenLastCalledWith(SYSTEM_ALERT_ACTION.RESOLVE, testRowAssigned);
        setup(
            {
                row: testRowAssigned,
                open: true,
                onCloseDrawer: onCloseDrawerFn,
                onSystemAlertUpdate: onSystemAlertUpdateFn,
            },
            { adminDashboardSystemAlertsReducer: { adminDashboardSystemAlertsUpdating: true } },
            rerender,
        );
        // when updating, resolve button is relabelled to 'Updating'
        expect(queryByRole('button', { name: locale.drawer.markResolved })).not.toBeInTheDocument();
        expect(getByRole('button', { name: locale.drawer.updating })).toHaveAttribute('disabled');
    });
});