import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import SearchKeyword from './SearchKeyword';

export const SearchKeywordsList = ({ keywordsListTitle, keywordsList, onKeywordClick }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                {keywordsListTitle}
            </Grid>
            {!!keywordsList &&
                keywordsList.length > 0 &&
                keywordsList.map(keywordItem => <SearchKeyword {...keywordItem} onKeywordClick={onKeywordClick} />)}
        </Grid>
    );
};

SearchKeywordsList.propTypes = {
    keywordsListTitle: PropTypes.string.isRequired,
    keywordsList: PropTypes.arrayOf(
        PropTypes.shape({
            keyword: PropTypes.string.isRequired,
            variant: PropTypes.string,
        }),
    ).isRequired,
    onKeywordClick: PropTypes.func.isRequired,
};

export default React.memo(SearchKeywordsList);
