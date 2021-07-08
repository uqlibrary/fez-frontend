import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import ExactMatchSearchKeywordsList from './partials/ExactMatchSearchKeywordsList';
import SearchKeywordsList from './partials/SearchKeywordsList';
import ForCodeSearchKeywordsList from './partials/ForCodeSearchKeywordsList';

import {
    getJournalSearchKeywords,
    getHasJournalSearchKeywordsError,
    getJournalSearchKeywordsError,
    getHasAnyKeywordsLoaded,
} from '../selectors';

import locale from 'locale/components';

export const KeywordsBrowser = ({ onKeywordAdd }) => {
    const txt = locale.components.journalSearch;
    // Subject to change
    const journalSearchKeywords = useSelector(getJournalSearchKeywords);
    const hasJournalSearchKeywordsFailed = useSelector(getHasJournalSearchKeywordsError);
    const journalSearchKeywordsError = useSelector(getJournalSearchKeywordsError);
    const hasAnyKeywordsLoaded = useSelector(getHasAnyKeywordsLoaded);

    /**
     * Handle click event on keyword
     *
     * @param {*} type Type of keyword (Title|Keyword|Subject)
     * @param {*} keyword Keyword string
     * @returns void
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleKeywordClick = React.useCallback((type, keyword) => onKeywordAdd({ type, text: keyword }), []);

    /**
     * Handle click event on FoR code matching keyword
     *
     * @param {*} keyword Keyword string
     * @returns void
     */
    const handleSubjectKeywordClick = React.useCallback(
        keyword => handleKeywordClick(txt.keywordsBrowser.forCodeMatch.chipTitle, keyword),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * Handle click event on Title containing keyword
     *
     * @param {*} keyword Keyword string
     * @returns void
     */
    const handleTitleKeywordClick = React.useCallback(
        keyword => handleKeywordClick(txt.keywordsBrowser.titleMatch.chipTitle, keyword),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * Handle click event on Keyword matching keyword
     *
     * @param {*} keyword Keyword string
     * @returns void
     */
    const handleKeywordsKeywordClick = React.useCallback(
        keyword => handleKeywordClick(txt.keywordsBrowser.keywordMatch.chipTitle, keyword),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    if (!hasAnyKeywordsLoaded) {
        return <div />;
    }

    return (
        <Grid container>
            {hasJournalSearchKeywordsFailed && (
                <Grid item>
                    <Alert {...journalSearchKeywordsError} />
                </Grid>
            )}
            {(journalSearchKeywords.exactMatch.length > 0 || journalSearchKeywords.titleMatch.length > 0) && (
                <Grid item xs={12} md={4}>
                    <Grid container>
                        {journalSearchKeywords.exactMatch.length > 0 && (
                            <Grid item xs={12}>
                                <ExactMatchSearchKeywordsList
                                    keywordsListTitle={txt.keywordsBrowser.exactMatch.title}
                                    keywordsList={journalSearchKeywords.exactMatch}
                                />
                            </Grid>
                        )}
                        {journalSearchKeywords.titleMatch.length > 0 && (
                            <Grid item xs={12}>
                                <SearchKeywordsList
                                    keywordsListTitle={txt.keywordsBrowser.titleMatch.title}
                                    keywordsList={journalSearchKeywords.titleMatch}
                                    onKeywordClick={handleTitleKeywordClick}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            )}
            {journalSearchKeywords.keywordMatch.length > 0 && (
                <Grid item xs={12} md={4}>
                    <SearchKeywordsList
                        keywordsListTitle={txt.keywordsBrowser.keywordMatch.title}
                        keywordsList={journalSearchKeywords.keywordMatch}
                        onKeywordClick={handleKeywordsKeywordClick}
                    />
                </Grid>
            )}
            {journalSearchKeywords.subjectMatch.length > 0 && (
                <Grid item xs={12} md={4}>
                    <ForCodeSearchKeywordsList
                        keywordsListTitle={txt.keywordsBrowser.forCodeMatch.title}
                        keywordsList={journalSearchKeywords.subjectMatch}
                        onKeywordClick={handleSubjectKeywordClick}
                    />
                </Grid>
            )}
        </Grid>
    );
};

KeywordsBrowser.propTypes = {
    onKeywordAdd: PropTypes.func.isRequired,
};

export default React.memo(KeywordsBrowser);
