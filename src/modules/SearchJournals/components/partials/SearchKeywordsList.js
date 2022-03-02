import React from 'react';
import PropTypes from 'prop-types';
import KeywordsList from './KeywordsList';
import SearchKeyword from './SearchKeyword';
export const SearchKeywordsList = ({ keywordsListTitle, keywordsList, onKeywordClick, keywordsType, help }) => (
    <KeywordsList
        title={keywordsListTitle}
        list={
            (!!keywordsList &&
                keywordsList.length > 0 &&
                keywordsList.map((keywordItem, index) => (
                    <SearchKeyword
                        index={index}
                        key={keywordItem.keyword}
                        keyword={keywordItem.keyword}
                        type={keywordsType}
                        title={keywordsListTitle}
                        variant="addable"
                        onKeywordClick={onKeywordClick}
                    />
                ))) ||
            []
        }
        help={help}
    />
);

SearchKeywordsList.propTypes = {
    keywordsListTitle: PropTypes.string.isRequired,
    keywordsList: PropTypes.arrayOf(
        PropTypes.shape({
            keyword: PropTypes.string.isRequired,
        }),
    ).isRequired,
    keywordsType: PropTypes.string.isRequired,
    onKeywordClick: PropTypes.func.isRequired,
    help: PropTypes.object,
};

export default React.memo(SearchKeywordsList);
