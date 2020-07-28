import React from 'react';
import { useDispatch } from 'react-redux';
// import PropTypes from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { loadFavouriteSearchList } from 'actions';
import pageLocale from 'locale/pages';

export const FavouriteSearch = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(loadFavouriteSearchList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <StandardPage title={pageLocale.pages.favouriteSearch.title} />;
};

export default React.memo(FavouriteSearch);
