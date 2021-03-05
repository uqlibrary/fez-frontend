import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorsList from './AuthorsList';

import { default as componentLocale } from 'locale/components';
import { default as locale } from 'locale/pages';
import {
    addAuthor,
    deleteAuthorListItem,
    loadAuthorList,
    updateAuthorListItem,
    showAppAlert,
    dismissAppAlert,
} from 'actions';

export const Authors = () => {
    const dispatch = useDispatch();

    const authorListLoading = useSelector(state => state.get('authorsListReducer').authorListLoading);
    const authorList = useSelector(state => state.get('authorsListReducer').authorList);
    const authorListError = useSelector(state => state.get('authorsListReducer').authorListError);

    const authorAddSuccess = useSelector(state => state.get('authorsListReducer').authorAddSuccess);

    const authorAddError = useSelector(state => state.get('authorsListReducer').authorAddError);

    const handleRowAdd = newData => {
        return dispatch(addAuthor(newData));
    };

    const handleRowUpdate = (newData, oldData) => {
        return dispatch(updateAuthorListItem(newData, oldData));
    };

    const handleRowDelete = oldData => {
        return dispatch(deleteAuthorListItem(oldData));
    };

    React.useEffect(() => {
        if (!authorList) {
            dispatch(loadAuthorList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (authorAddSuccess) {
            dispatch(
                showAppAlert({
                    ...componentLocale.components.authorList.successAlert,
                    dismissAction: () => dispatch(dismissAppAlert()),
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authorAddSuccess]);

    if (authorListLoading) {
        return (
            <StandardPage>
                <InlineLoader message={locale.pages.editorialAppointments.loadingMessage} />
            </StandardPage>
        );
    }

    return (
        <StandardPage title={locale.pages.editorialAppointments.title}>
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
                    {!!authorList && (
                        <StandardCard hideTitle>
                            <AuthorsList
                                handleRowAdd={handleRowAdd}
                                handleRowUpdate={handleRowUpdate}
                                handleRowDelete={handleRowDelete}
                                list={authorList}
                            />
                        </StandardCard>
                    )}
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(Authors);
