import React from 'react';
import PropTypes from 'prop-types';
import KeywordsList from './KeywordsList';
import SearchKeyword from './SearchKeyword';
export const SearchKeywordsList = ({
    keywordsListTitle,
    keywordsList,
    onKeywordClick,
    keywordsType,
    help,
    selectedKeywords,
}) => {
    console.log('This is the one that I need to target', selectedKeywords);
    return (
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
                            selectedKeywords={selectedKeywords}
                        />
                    ))) ||
                []
            }
            help={help}
        />
    );
};

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
    selectedKeywords: PropTypes.object,
};

export default React.memo(SearchKeywordsList);
