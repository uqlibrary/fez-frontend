import React from 'react';
import { useDispatch } from 'react-redux';

import Grid from '@mui/material/GridLegacy';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ManageUsersNewList from './ManageUsersList';

import { default as locale } from 'locale/pages';
import { addUser, bulkDeleteUserListItems, deleteUserListItem, updateUserListItem } from 'actions';
import ActionFeedback from './partials/ActionFeedback';

export const ManageUsers = () => {
    const dispatch = useDispatch();

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

    return (
        <StandardPage title={locale.pages.users.title}>
            <Grid container spacing={2}>
                <ActionFeedback />
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
