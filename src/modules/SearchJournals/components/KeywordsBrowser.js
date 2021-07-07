import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import ExactMatchSearchKeywordsList from './partials/ExactMatchSearchKeywordsList';
import SearchKeywordsList from './partials/SearchKeywordsList';
import ForCodeSearchKeywordsList from './partials/ForCodeSearchKeywordsList';

import locale from 'locale/components';

export const KeywordsBrowser = ({ onKeywordAdd }) => {
    const txt = locale.components.journalSearch;
    // Subject to change
    const journalSearchKeywords = useSelector(
        state =>
            (state.get('journalSearchReducer') || {}).journalSearchKeywords || {
                exactMatch: [
                    { keyword: 'Medicine', title: 'Medicine', href: '/journal/view/1' },
                    { keyword: 'Engineering', title: 'Engineering', href: '/journal/view/2' },
                ],
                titleMatch: [
                    { keyword: 'Medicine' },
                    { keyword: 'Medicines' },
                    { keyword: 'Audiological Medicine' },
                    { keyword: 'Gender Medicine' },
                ],
                keywordMatch: [{ keyword: 'Medicine' }, { keyword: 'Medicines' }, { keyword: 'Medical' }],
                subjectMatch: [
                    {
                        keyword: '1001 Medicine',
                        sources: [{ name: 'asic' }, { name: 'abdc' }, { name: 'wos', index: 'ssci' }],
                    },
                    {
                        keyword: '1003 Medicines',
                        sources: [{ name: 'asic' }, { name: 'era' }, { name: 'wos', index: 'scie' }],
                    },
                ],
            },
    );

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
        keyword => handleKeywordClick(txt.keywordsBrowser.keywordsMatch.chipTitle, keyword),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <Grid container>
            <Grid item xs={12} md={4}>
                <Grid container>
                    <Grid item xs={12}>
                        <ExactMatchSearchKeywordsList
                            keywordsListTitle={txt.keywordsBrowser.exactMatch.title}
                            keywordsList={journalSearchKeywords.exactMatch}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SearchKeywordsList
                            keywordsListTitle={txt.keywordsBrowser.titleMatch.title}
                            keywordsList={journalSearchKeywords.titleMatch}
                            onKeywordClick={handleTitleKeywordClick}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
                <SearchKeywordsList
                    keywordsListTitle={txt.keywordsBrowser.keywordMatch.title}
                    keywordsList={journalSearchKeywords.keywordMatch}
                    onKeywordClick={handleKeywordsKeywordClick}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <ForCodeSearchKeywordsList
                    keywordsListTitle={txt.keywordsBrowser.forCodeMatch.title}
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
