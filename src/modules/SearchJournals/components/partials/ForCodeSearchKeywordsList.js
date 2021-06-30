import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import ForCodeSearchKeyword from './ForCodeSearchKeyword';

export const ForCodeSearchKeywordsList = ({ keywordsListTitle, keywordsList }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                {keywordsListTitle}
            </Grid>
            {!!keywordsList &&
                keywordsList.length > 0 &&
                keywordsList.map(keywordItem => <ForCodeSearchKeyword {...keywordItem} />)}
        </Grid>
    );
};

ForCodeSearchKeywordsList.propTypes = {
    keywordsListTitle: PropTypes.string.isRequired,
    keywordsList: PropTypes.arrayOf(
        PropTypes.shape({
            keyword: PropTypes.string.isRequired,
            onClickKeyword: PropTypes.func.isRequired,
            sources: PropTypes.array.isRequired,
        }),
    ).isRequired,
};

export default React.memo(ForCodeSearchKeywordsList);
