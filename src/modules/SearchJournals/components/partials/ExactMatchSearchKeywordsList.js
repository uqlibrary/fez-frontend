import React from 'react';
import PropTypes from 'prop-types';

import SearchKeyword from './SearchKeyword';
import KeywordsList from './KeywordsList';
import ExternalLink from 'modules/SharedComponents/ExternalLink';

export const ExactMatchSearchKeywordsList = ({ keywordsListTitle, keywordsList }) => (
    <KeywordsList
        title={keywordsListTitle}
        list={
            !!keywordsList &&
            keywordsList.length > 0 &&
            keywordsList.map(keywordItem => (
                <ExternalLink title={keywordItem.title} href={keywordItem.href}>
                    <SearchKeyword keyword={keywordItem.keyword} />
                </ExternalLink>
            ))
        }
    />
);

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
