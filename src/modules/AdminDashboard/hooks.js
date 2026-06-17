import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useConfirmationState } from 'hooks';
import { isEmptyStr } from './utils';
import { getSystemAlertColumns, buildStatusFilterOptions, buildAdminUserOptions } from './config';

const EMPTY_ARRAY = [];

export const useSystemAlertDrawer = data => {
    const [_open, _setOpen] = React.useState(false);
    const [_row, _setRow] = React.useState({});

    React.useEffect(() => {
        if (_open) {
            _setRow(data?.find(item => item.sat_id === _row.sat_id) || /* istanbul ignore next */ {});
        }
    }, [_open, _row.sat_id, data]);

    const openDrawer = row => {
        _setRow(row);
        _setOpen(true);
    };
    const closeDrawer = () => {
        _setRow({});
        _setOpen(false);
    };
    return {
        open: _open,
        row: _row,
        openDrawer,
        closeDrawer,
    };
};

export const useAlertStatus = ({ message, hideAction }) => {
    const dispatch = useDispatch();
    const [alertIsVisible, _showAlert, _hideAlert] = useConfirmationState();

    const [_message, setMessage] = React.useState(message);

    const showAlert = message => {
        setMessage(message);
        _showAlert();
    };

    const hideAlert = () => {
        hideAction && dispatch(hideAction());
        _hideAlert();
    };

    React.useEffect(() => {
        if (!alertIsVisible) {
            if (!isEmptyStr(message)) _showAlert();
        }
    }, [_showAlert, alertIsVisible, message]);

    return [alertIsVisible, hideAlert, showAlert, _message];
};

export const useAdminDashboardConfig = () => {
    return useSelector(state => state.get('adminDashboardConfigReducer')?.adminDashboardConfigData || {});
};

export const useAdminUsers = () => {
    const config = useAdminDashboardConfig();

    return {
        users: config.admin_users ?? EMPTY_ARRAY,
        currentUser: config.logged_in_user,
    };
};

export const useAdminUserOptions = unassignedLabel => {
    const { users, currentUser } = useAdminUsers();

    return React.useMemo(
        () => buildAdminUserOptions(users, currentUser, unassignedLabel),
        [users, currentUser, unassignedLabel],
    );
};

export const useSystemAlertColumns = locale => {
    const { users, currentUser } = useAdminUsers();

    const statusOptions = React.useMemo(
        () => buildStatusFilterOptions(users, currentUser, locale),
        [users, currentUser, locale],
    );

    return React.useMemo(
        () => getSystemAlertColumns(locale, users, currentUser, statusOptions),
        [locale, users, currentUser, statusOptions],
    );
};
