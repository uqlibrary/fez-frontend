import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import ForCodeSearchKeyword from './ForCodeSearchKeyword';

export const ForCodeSearchKeywordsList = ({ keywordsListTitle, keywordsList, onKeywordClick }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                {keywordsListTitle}
            </Grid>
            {!!keywordsList &&
                keywordsList.length > 0 &&
                keywordsList.map(keywordItem => (
                    <ForCodeSearchKeyword {...keywordItem} onKeywordClick={onKeywordClick} />
                ))}
        </Grid>
    );
};

ForCodeSearchKeywordsList.propTypes = {
    keywordsListTitle: PropTypes.string.isRequired,
    keywordsList: PropTypes.arrayOf(
        PropTypes.shape({
            keyword: PropTypes.string.isRequired,
            sources: PropTypes.array.isRequired,
        }),
    ).isRequired,
    onKeywordClick: PropTypes.func.isRequired,
};

export default React.memo(ForCodeSearchKeywordsList);
