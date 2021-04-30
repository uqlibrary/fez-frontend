import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ManageUsersNewList from './ManageUsersList';

import { default as componentLocale } from 'locale/components';
import { default as locale } from 'locale/pages';
import {
    addUser,
    bulkDeleteUserListItems,
    deleteUserListItem,
    dismissAppAlert,
    showAppAlert,
    updateUserListItem,
} from 'actions';

export const getBulkDeleteMessages = messages => {
    const deleteMessages = [];

    for (const [userId, message] of Object.entries(messages)) {
        deleteMessages.push(
            <li key={`bulk-delete-user-${userId}`} data-testid={`bulk-delete-user-${userId}`}>
                <strong>{userId}</strong> - <span>{message}</span>
            </li>,
        );
    }
    const message = (
        <span>
            <ul>{deleteMessages}</ul>
        </span>
    );
    return message;
};

export const ManageUsers = () => {
    const dispatch = useDispatch();

    const userListError = useSelector(state => state.get('manageUsersReducer').userListError);
    const userAddSuccess = useSelector(state => state.get('manageUsersReducer').userAddSuccess);
    const userAddError = useSelector(state => state.get('manageUsersReducer').userAddError);
    const bulkUserDeleteMessages = useSelector(state => state.get('manageUsersReducer').bulkUserDeleteMessages);

    const handleRowAdd = newData => {
        return dispatch(addUser(newData));
    };

    const handleRowUpdate = (newData, oldData) => {
        return dispatch(updateUserListItem(newData, oldData));
    };

    const handleRowDelete = oldData => {
        return dispatch(deleteUserListItem(oldData));
    };

    const handleBulkRowDelete = data => {
        return dispatch(bulkDeleteUserListItems(data));
    };

    React.useEffect(() => {
        if (userAddSuccess) {
            dispatch(
                showAppAlert({
                    ...componentLocale.components.manageUsers.successAlert,
                    dismissAction: () => dispatch(dismissAppAlert()),
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userAddSuccess]);

    return (
        <StandardPage title={locale.pages.users.title}>
            <Grid container spacing={2}>
                {!!userListError && (
                    <Grid item xs={12}>
                        <Alert {...userListError} type="error" alertId="alert-error-users-list" />
                    </Grid>
                )}
                {!!userAddError && (
                    <Grid item xs={12}>
                        <Alert {...userAddError} type="error" alertId="alert-error-user-add" />
                    </Grid>
                )}
                {!!bulkUserDeleteMessages && (
                    <Grid item xs={12}>
                        <Alert
                            message={getBulkDeleteMessages(bulkUserDeleteMessages)}
                            type="done"
                            alertId="alert-success-user-bulk-delete"
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <StandardCard noHeader>
                        <ManageUsersNewList
                            onRowAdd={handleRowAdd}
                            onRowUpdate={handleRowUpdate}
                            onRowDelete={handleRowDelete}
                            onBulkRowDelete={handleBulkRowDelete}
                        />
                    </StandardCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(ManageUsers);
