import React from 'react';
import PropTypes from 'prop-types';

import KeywordsList from './KeywordsList';
import ForCodeSearchKeyword from './ForCodeSearchKeyword';

export const ForCodeSearchKeywordsList = ({ keywordsListTitle, keywordsList, onKeywordClick }) => (
    <KeywordsList
        title={keywordsListTitle}
        list={
            !!keywordsList &&
            keywordsList.length > 0 &&
            keywordsList.map(keywordItem => <ForCodeSearchKeyword {...keywordItem} onKeywordClick={onKeywordClick} />)
        }
    />
);

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
