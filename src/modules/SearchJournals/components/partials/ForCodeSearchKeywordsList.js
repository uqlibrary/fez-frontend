import React from 'react';
import PropTypes from 'prop-types';
import KeywordsList from './KeywordsList';
import ForCodeSearchKeyword from './ForCodeSearchKeyword';
import { locale } from '../../../../locale';

export const ForCodeSearchKeywordsList = ({ keywordsListTitle, keywordsList, onKeywordClick }) => {
    const txt = locale.components.searchJournals.partials.forCodeSearchKeywordsList;
    return (
        <KeywordsList
            title={keywordsListTitle}
            list={
                (!!keywordsList &&
                    keywordsList.length > 0 &&
                    keywordsList.map((keywordItem, index) => (
                        <ForCodeSearchKeyword
                            index={index}
                            key={keywordItem.keyword}
                            {...keywordItem}
                            onKeywordClick={onKeywordClick}
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
            sources: PropTypes.array.isRequired,
        }),
    ),
    onKeywordClick: PropTypes.func.isRequired,
};

export default React.memo(ForCodeSearchKeywordsList);
