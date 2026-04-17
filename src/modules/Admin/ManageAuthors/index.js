import React from 'react';
import { useDispatch } from 'react-redux';

import Grid from '@mui/material/GridLegacy';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ManageAuthorsNewList from './ManageAuthorsList';
import ActionFeedback from './partials/ActionFeedback';

import { default as locale } from 'locale/pages';
import {
    addAuthor,
    bulkDeleteAuthorListItems,
    deleteAuthorListItem,
    ingestFromScopus,
    updateAuthorListItem,
} from 'actions';

export const ManageAuthors = () => {
    const dispatch = useDispatch();

    const handleRowAdd = newData => {
        return dispatch(addAuthor(newData));
    };

    const handleRowUpdate = newData => {
        return dispatch(updateAuthorListItem(newData));
    };

    const handleRowDelete = oldData => {
        return dispatch(deleteAuthorListItem(oldData));
    };

    const handleBulkRowDelete = data => {
        return dispatch(bulkDeleteAuthorListItems(data));
    };

    const handleAuthorScopusIngest = autId => dispatch(ingestFromScopus(autId));

    return (
        <StandardPage title={locale.pages.authors.title}>
            <Grid container spacing={2}>
                <ActionFeedback />
                <Grid item xs={12}>
                    <StandardCard noHeader>
                        <ManageAuthorsNewList
                            onBulkRowDelete={handleBulkRowDelete}
                            onRowAdd={handleRowAdd}
                            onRowUpdate={handleRowUpdate}
                            onRowDelete={handleRowDelete}
                            onScopusIngest={handleAuthorScopusIngest}
                        />
                    </StandardCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(ManageAuthors);
