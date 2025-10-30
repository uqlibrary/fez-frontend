import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import ExactMatchSearchKeywordsList from './partials/ExactMatchSearchKeywordsList';
import SearchKeywordsList from './partials/SearchKeywordsList';
import ForCodeSearchKeywordsList from './partials/ForCodeSearchKeywordsList';

import locale from 'locale/components';
const StyledGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        paddingLeft: '5px',
        paddingRight: '5px',
        borderStyle: 'dashed',
        borderColor: '#CCC',
        borderWidth: '0 0 0 1px',
        marginTop: '10px',
    },
}));

export const KeywordsBrowser = ({ onKeywordAdd, onKeywordDelete, selectedKeywords }) => {
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

    /* c8 ignore next */
    const handleKeywordClick = React.useCallback(
        (isSelected, type, keyword, cvoId) => {
            if (!!!isSelected) {
                return onKeywordAdd({ type, text: keyword, ...(cvoId ? { cvoId } : {}) });
            } else {
                const id = cvoId ? `${type}-${cvoId}` : `${type}-${keyword}`;
                return onKeywordDelete({ type, text: keyword, ...(id ? { id } : {}), ...(cvoId ? { cvoId } : {}) });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * Handle click event on FoR code matching keyword
     *
     * @param {string} keyword Keyword string
     * @returns void
     */
    /* c8 ignore next */
    const handleSubjectKeywordClick = React.useCallback(
        (isSelected, keyword, cvoId) => {
            handleKeywordClick(isSelected, txt.forCodeMatch.chipTitle, keyword, cvoId);
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
    /* c8 ignore next */
    const handleTitleKeywordClick = React.useCallback(
        (isSelected, keyword) => {
            return handleKeywordClick(isSelected, txt.titleMatch.chipTitle, keyword);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * Handle click event on Keyword matching keyword
     *
     * @param {string} keyword Keyword string
     * @returns void
     */
    /* c8 ignore next */
    const handleKeywordsKeywordClick = React.useCallback(
        (isSelected, keyword) => {
            return handleKeywordClick(isSelected, txt.keywordMatch.chipTitle, keyword);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    if (!hasAnyKeywordsLoaded && isInitialValues) {
        return <div />;
    }
    return (
        <Grid container spacing={0}>
            {hasJournalSearchKeywordsFailed && (
                <Grid item>
                    <Alert {...journalSearchKeywordsError} />
                </Grid>
            )}
            <Grid item xs={12} style={{ padding: '10px 0' }}>
                <Typography role="alert" aria-label={txt.aria_label}>
                    <b>{txt.titlePrefix}</b>&nbsp;{txt.title}
                </Typography>
            </Grid>
            <Grid item xs={12} md={3} style={{ marginTop: '10px' }}>
                <Grid container>
                    {hasExactKeywords && (
                        <Grid item xs={12} style={{ marginBottom: '10px' }}>
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
                            selectedKeywords={selectedKeywords}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <StyledGrid item xs={12} md={3} style={{ marginTop: '10px' }}>
                <SearchKeywordsList
                    keywordsListTitle={txt.keywordMatch.title}
                    keywordsList={journalSearchKeywords.keywordMatch}
                    keywordsType={'keyword'}
                    onKeywordClick={handleKeywordsKeywordClick}
                    selectedKeywords={selectedKeywords}
                />
            </StyledGrid>
            <StyledGrid item xs={12} md={6} style={{ marginTop: '10px', paddingRight: 0 }}>
                <ForCodeSearchKeywordsList
                    keywordsListTitle={txt.forCodeMatch.title}
                    keywordsList={journalSearchKeywords.subjectMatch}
                    onKeywordClick={handleSubjectKeywordClick}
                    selectedKeywords={selectedKeywords}
                />
            </StyledGrid>
        </Grid>
    );
};

KeywordsBrowser.propTypes = {
    onKeywordAdd: PropTypes.func.isRequired,
    onKeywordDelete: PropTypes.func,
    selectedKeywords: PropTypes.object,
};

export default React.memo(KeywordsBrowser);
