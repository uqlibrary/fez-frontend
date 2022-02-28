import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import ExactMatchSearchKeywordsList from './partials/ExactMatchSearchKeywordsList';
import SearchKeywordsList from './partials/SearchKeywordsList';
import ForCodeSearchKeywordsList from './partials/ForCodeSearchKeywordsList';

import locale from 'locale/components';

export const KeywordsBrowser = ({ onKeywordAdd }) => {
    const txt = locale.components.searchJournals.partials.keywordsBrowser;
    const journalSearchKeywords = useSelector(state => state.get('journalReducer').journalSearchKeywords);
    const isInitialValues = useSelector(state => state.get('journalReducer').isInitialValues);
    const journalSearchKeywordsError = useSelector(state => state.get('journalReducer').journalSearchKeywordsError);
    const hasJournalSearchKeywordsFailed = !!journalSearchKeywordsError;
    const hasExactKeywords = journalSearchKeywords.exactMatch.length > 0;
    const hasTitleKeywords = journalSearchKeywords.titleMatch.length > 0;
    const hasKeywordKeywords = journalSearchKeywords.keywordMatch.length > 0;
    const hasSubjectKeywords = journalSearchKeywords.subjectMatch.length > 0;
    const hasAnyKeywordsLoaded = hasExactKeywords || hasTitleKeywords || hasKeywordKeywords || hasSubjectKeywords;

    /**
     * Handle click event on keyword
     *
     * @param {string} type Type of keyword (Title|Keyword|Subject)
     * @param {string} keyword Keyword string
     * @returns void
     */

    /* istanbul ignore next */
    const handleKeywordClick = React.useCallback(
        (type, keyword, cvoId) => onKeywordAdd({ type, text: keyword, ...(cvoId ? { cvoId } : {}) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * Handle click event on FoR code matching keyword
     *
     * @param {string} keyword Keyword string
     * @returns void
     */
    /* istanbul ignore next */
    const handleSubjectKeywordClick = React.useCallback(
        (keyword, cvoId) => {
            handleKeywordClick(txt.forCodeMatch.chipTitle, keyword, cvoId);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * Handle click event on Title containing keyword
     *
     * @param {string} keyword Keyword string
     * @returns void
     */
    /* istanbul ignore next */
    const handleTitleKeywordClick = React.useCallback(
        keyword => handleKeywordClick(txt.titleMatch.chipTitle, keyword),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * Handle click event on Keyword matching keyword
     *
     * @param {string} keyword Keyword string
     * @returns void
     */
    /* istanbul ignore next */
    const handleKeywordsKeywordClick = React.useCallback(
        keyword => handleKeywordClick(txt.keywordMatch.chipTitle, keyword),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    if (!hasAnyKeywordsLoaded && isInitialValues) {
        return <div />;
    }
    const separator = <div style={{ width: 1, borderRight: '1px dashed #CCC', marginTop: 12 }} />;

    return (
        <Grid container spacing={0}>
            {hasJournalSearchKeywordsFailed && (
                <Grid item>
                    <Alert {...journalSearchKeywordsError} />
                </Grid>
            )}
            <Grid item xs={12} style={{ padding: '10px 0 10px 0' }}>
                <Typography role="alert" aria-label={txt.aria_label}>
                    <b>{txt.titlePrefix}</b>&nbsp;{txt.title}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} style={{ margin: '0 -1px 0 -1px' }}>
                <Grid container>
                    {hasExactKeywords && (
                        <Grid item xs={12}>
                            <ExactMatchSearchKeywordsList
                                keywordsListTitle={txt.exactMatch.title}
                                keywordsList={journalSearchKeywords.exactMatch}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <SearchKeywordsList
                            keywordsListTitle={txt.titleMatch.title}
                            keywordsList={journalSearchKeywords.titleMatch}
                            keywordsType={'title'}
                            onKeywordClick={handleTitleKeywordClick}
                        />
                    </Grid>
                </Grid>
            </Grid>
            {separator}
            <Grid item xs={12} sm={6} md={3} style={{ margin: '0 -1px 0 -1px', paddingLeft: 24 }}>
                <SearchKeywordsList
                    keywordsListTitle={txt.keywordMatch.title}
                    keywordsList={journalSearchKeywords.keywordMatch}
                    keywordsType={'keyword'}
                    onKeywordClick={handleKeywordsKeywordClick}
                />
            </Grid>
            {separator}
            <Grid item xs={12} sm={12} md style={{ margin: '0 -1px 0 -1px', paddingLeft: 24 }}>
                <ForCodeSearchKeywordsList
                    keywordsListTitle={txt.forCodeMatch.title}
                    keywordsList={journalSearchKeywords.subjectMatch}
                    onKeywordClick={handleSubjectKeywordClick}
                />
            </Grid>
        </Grid>
    );
};

KeywordsBrowser.propTypes = {
    onKeywordAdd: PropTypes.func.isRequired,
};

export default React.memo(KeywordsBrowser);
