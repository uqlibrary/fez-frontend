import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ManageAuthorsNewList from './ManageAuthorsList';

import { default as componentLocale } from 'locale/components';
import { default as locale } from 'locale/pages';
import { addAuthor, deleteAuthorListItem, updateAuthorListItem, showAppAlert, dismissAppAlert } from 'actions';

export const ManageAuthors = () => {
    const dispatch = useDispatch();

    const authorListError = useSelector(state => state.get('manageAuthorsReducer').authorListError);
    const authorAddSuccess = useSelector(state => state.get('manageAuthorsReducer').authorAddSuccess);
    const authorAddError = useSelector(state => state.get('manageAuthorsReducer').authorAddError);

    const handleRowAdd = newData => {
        return dispatch(addAuthor(newData));
    };

    const handleRowUpdate = newData => {
        return dispatch(updateAuthorListItem(newData));
    };

    const handleRowDelete = oldData => {
        return dispatch(deleteAuthorListItem(oldData));
    };

    React.useEffect(() => {
        if (authorAddSuccess) {
            dispatch(
                showAppAlert({
                    ...componentLocale.components.manageAuthors.successAlert,
                    dismissAction: () => dispatch(dismissAppAlert()),
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authorAddSuccess]);

    return (
        <StandardPage title={locale.pages.authors.title}>
            <Grid container spacing={2}>
                {!!authorListError && (
                    <Grid item xs={12}>
                        <Alert {...authorListError} type="error" alertId="alert-error-authors-list" />
                    </Grid>
                )}
                {!!authorAddError && (
                    <Grid item xs={12}>
                        <Alert {...authorAddError} type="error" alertId="alert-error-author-add" />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <StandardCard noHeader>
                        <ManageAuthorsNewList
                            onRowAdd={handleRowAdd}
                            onRowUpdate={handleRowUpdate}
                            onRowDelete={handleRowDelete}
                        />
                    </StandardCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(ManageAuthors);
