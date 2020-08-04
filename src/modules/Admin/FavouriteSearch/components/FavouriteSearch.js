import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import FavouriteSearchList from './FavouriteSearchList';

import { loadFavouriteSearchList } from 'actions';
import pageLocale from 'locale/pages';

export const FavouriteSearch = () => {
    const dispatch = useDispatch();
    const txt = pageLocale.pages.favouriteSearch;
    const favouriteSearchListLoading = useSelector(
        state => state.get('favouriteSearchReducer').favouriteSearchListLoading,
    );
    const favouriteSearchList = useSelector(state => state.get('favouriteSearchReducer').favouriteSearchList);

    React.useEffect(() => {
        dispatch(loadFavouriteSearchList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (favouriteSearchListLoading) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    return (
        <StandardPage title={txt.title}>
            {!!favouriteSearchList && (
                <Grid container>
                    <Grid item xs={12}>
                        <FavouriteSearchList list={favouriteSearchList} />
                    </Grid>
                </Grid>
            )}
        </StandardPage>
    );
};

export default React.memo(FavouriteSearch);
