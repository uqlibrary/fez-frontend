import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import SearchKeyword from './SearchKeyword';
import ExternalLink from 'modules/SharedComponents/ExternalLink';

export const ExactMatchSearchKeywordsList = ({ keywordsListTitle, keywordsList }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                {keywordsListTitle}
            </Grid>
            {!!keywordsList &&
                keywordsList.length > 0 &&
                keywordsList.map(keywordItem => (
                    <ExternalLink title={keywordItem.title} href={keywordItem.href}>
                        <SearchKeyword keyword={keywordItem.keyword} />
                    </ExternalLink>
                ))}
        </Grid>
    );
};

ExactMatchSearchKeywordsList.propTypes = {
    keywordsListTitle: PropTypes.string.isRequired,
    keywordsList: PropTypes.arrayOf(
        PropTypes.shape({
            keyword: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            href: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default React.memo(ExactMatchSearchKeywordsList);
