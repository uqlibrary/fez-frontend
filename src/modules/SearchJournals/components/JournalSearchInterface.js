import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import JournalSearchInput from './JournalSearchInput';
import SelectedKeywords from './SelectedKeywords';
import KeywordsBrowser from './KeywordsBrowser';
import Snackbar from '@material-ui/core/Snackbar';

import locale from 'locale/components';
import { pathConfig } from 'config/pathConfig';
import { useJournalSearchInterfaceState, useSelectedKeywords, useJournalSearchQueryParams } from '../hooks';

export const JournalSearchInterface = ({ onSearch, initialSelectedKeywords }) => {
    const theme = useTheme();
    const { journalSearchQueryParams } = useJournalSearchQueryParams();
    const [snackbarNotify, setSnackbarNotify] = React.useState(false);
    const {
        showKeywordsBrowser,
        showJournalSearchInput,
        showButtons,
        toggleKeywordsBrowser,
        toggleJournalSearchInput,
        toggleButtons,
    } = useJournalSearchInterfaceState(!journalSearchQueryParams.keywords);

    const txt = locale.components.journalSearch;

    const { selectedKeywords, handleKeywordAdd, handleKeywordDelete, hasAnySelectedKeywords } = useSelectedKeywords(
        initialSelectedKeywords,
    );
    const handleFavouriteJournalsClick = React.useCallback(() => history.push(pathConfig.journal.favourite), []);
    const handleBrowseAllJournalsClick = React.useCallback(() => history.push(pathConfig.journal.browseAll), []);
    const handleSearchJournalsClick = React.useCallback(() => {
        toggleJournalSearchInput();
        toggleKeywordsBrowser();
        toggleButtons();
        onSearch(selectedKeywords);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeywords]);
    const handleSnackbarOpen = () => {
        setSnackbarNotify(true);
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarNotify(false);
    };

    React.useEffect(() => {
        if (initialSelectedKeywords !== selectedKeywords) {
            handleSnackbarOpen();
        }
    }, [selectedKeywords]);
    return (
        <StandardCard
            customTitleColor={theme.palette.primary.main}
            title={txt.journalSearchInterface.title}
            style={{ padding: 16 }}
        >
            <Snackbar
                id="journal-search-snackbar"
                data-testid="journal-search-snackbar"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackbarNotify}
                onClose={handleSnackbarClose}
                autoHideDuration={1000}
                message={<span>Search list updated</span>}
            />
            <Grid container spacing={2}>
                {showJournalSearchInput && (
                    <Grid item xs={12}>
                        <JournalSearchInput />
                    </Grid>
                )}
                {hasAnySelectedKeywords && (
                    <Grid item xs={12}>
                        <SelectedKeywords
                            onKeywordDelete={handleKeywordDelete}
                            keywords={Object.values(selectedKeywords)}
                        />
                    </Grid>
                )}
                {showKeywordsBrowser && (
                    <Grid item xs={12}>
                        <KeywordsBrowser onKeywordAdd={handleKeywordAdd} />
                    </Grid>
                )}
                {showButtons && (
                    <Grid item xs={12}>
                        <Grid container spacing={2} justify="flex-end">
                            <Grid item xs={12} sm="auto">
                                <Button
                                    children={txt.journalSearchInterface.buttons.myFavouriteJournals.title}
                                    aria-label={txt.journalSearchInterface.buttons.myFavouriteJournals.aria}
                                    onClick={handleFavouriteJournalsClick}
                                    id="journal-search-favourite-journals-button"
                                    data-testid="journal-search-favourite-journals-button"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <Button
                                    id="journal-search-browse-all-button"
                                    data-testid="journal-search-browse-all-button"
                                    children={txt.journalSearchInterface.buttons.browseAllJournals.title}
                                    aria-label={txt.journalSearchInterface.buttons.browseAllJournals.aria}
                                    onClick={handleBrowseAllJournalsClick}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs="auto">
                                <Button
                                    disabled={!hasAnySelectedKeywords}
                                    variant="contained"
                                    children={txt.journalSearchInterface.buttons.searchJournals.title}
                                    aria-label={txt.journalSearchInterface.buttons.searchJournals.aria}
                                    type="submit"
                                    color="primary"
                                    onClick={handleSearchJournalsClick}
                                    id="journal-search-button"
                                    data-testid="journal-search-button"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </StandardCard>
    );
};

JournalSearchInterface.propTypes = {
    onSearch: PropTypes.func,
    initialSelectedKeywords: PropTypes.object,
};

export default React.memo(JournalSearchInterface);
