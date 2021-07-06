import React from 'react';
import PropTypes from 'prop-types';

import KeywordsList from './KeywordsList';

import SearchKeyword from './SearchKeyword';

export const SearchKeywordsList = ({ keywordsListTitle, keywordsList, onKeywordClick }) => (
    <KeywordsList
        title={keywordsListTitle}
        list={
            !!keywordsList &&
            keywordsList.length > 0 &&
            keywordsList.map(keywordItem => <SearchKeyword {...keywordItem} onKeywordClick={onKeywordClick} />)
        }
    />
);

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
