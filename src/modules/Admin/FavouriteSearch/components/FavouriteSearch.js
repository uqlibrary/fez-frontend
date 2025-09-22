import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import FavouriteSearchList from './FavouriteSearchList';

import { deleteFavouriteSearchListItem, loadFavouriteSearchList, updateFavouriteSearchListItem } from 'actions';
import pageLocale from 'locale/pages';

export const FavouriteSearch = () => {
    const dispatch = useDispatch();
    const txt = pageLocale.pages.favouriteSearch;
    const favouriteSearchListLoading = useSelector(
        state => state.get('favouriteSearchReducer').favouriteSearchListLoading,
    );
    const favouriteSearchList = useSelector(state => state.get('favouriteSearchReducer').favouriteSearchList);
    const existingAliasCheckError = useSelector(state => state.get('favouriteSearchReducer').existingAliasCheckError);

    React.useEffect(() => {
        dispatch(loadFavouriteSearchList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRowUpdate = (newData, oldData) => {
        const oldD = { ...oldData };
        delete oldD.tableData;
        const newD = { ...newData };
        delete newD.tableData;
        // delete newData.tableData;
        return dispatch(updateFavouriteSearchListItem(newD, oldD));
    };

    const handleRowDelete = oldData => {
        return dispatch(deleteFavouriteSearchListItem(oldData));
    };

    if (favouriteSearchListLoading) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    return (
        <StandardPage title={txt.title}>
            {!!favouriteSearchList && (
                <Grid container spacing={2}>
                    {!!existingAliasCheckError && (
                        <Grid item xs={12}>
                            <Alert {...existingAliasCheckError} />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <FavouriteSearchList
                            handleRowDelete={handleRowDelete}
                            handleRowUpdate={handleRowUpdate}
                            list={favouriteSearchList}
                        />
                    </Grid>
                </Grid>
            )}
        </StandardPage>
    );
};

export default React.memo(FavouriteSearch);
