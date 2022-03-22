import React from 'react';
import PropTypes from 'prop-types';
import KeywordsList from './KeywordsList';
import SearchKeyword from './SearchKeyword';

import locale from 'locale/components';

export const ForCodeSearchKeywordsList = ({ keywordsListTitle, keywordsList, onKeywordClick }) => {
    const txt = locale.components.searchJournals.partials.forCodeSearchKeywordsList;
    return (
        <KeywordsList
            title={keywordsListTitle}
            list={
                (!!keywordsList &&
                    keywordsList.length > 0 &&
                    keywordsList.map((keywordItem, index) => (
                        <SearchKeyword
                            index={index}
                            key={`${keywordItem.keyword}-${index}`}
                            {...keywordItem}
                            onKeywordClick={onKeywordClick}
                            type={'subject'}
                            variant={'addable'}
                        />
                    ))) ||
                []
            }
            help={txt.help.KeywordSearchFORSubject}
        />
    );
};

ForCodeSearchKeywordsList.propTypes = {
    keywordsListTitle: PropTypes.string.isRequired,
    keywordsList: PropTypes.arrayOf(
        PropTypes.shape({
            keyword: PropTypes.string.isRequired,
            cvoId: PropTypes.number.isRequired,
            sources: PropTypes.array.isRequired,
        }),
    ).isRequired,
    onKeywordClick: PropTypes.func.isRequired,
};

export default React.memo(ForCodeSearchKeywordsList);
