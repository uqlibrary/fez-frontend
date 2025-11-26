import React from 'react';
import PropTypes from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Button from '@mui/material/Button';
import Grid from '@mui/material/GridLegacy';
import JournalSearchInput from './JournalSearchInput';
import SelectedKeywords from './SelectedKeywords';
import KeywordsBrowser from './KeywordsBrowser';
import Snackbar from '@mui/material/Snackbar';
import locale from 'locale/components';
import { CommonButtons } from 'modules/SharedComponents/JournalsCommonButtons';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import { AddToSelectedSubjects } from './partials/AddToSelectedSubjects';

export const id = 'journal-search-interface';

export const JournalSearchInterface = ({
    onSearch,
    onSearchAll,
    selectedKeywords,
    handleKeywordAdd,
    handleKeywordDelete,
    handleKeywordReset,
    hasAnySelectedKeywords = false,
    showInputControls = true,
}) => {
    const [snackbarNotify, setSnackbarNotify] = React.useState(false);
    const initialSelectedKeywords = React.useRef(selectedKeywords);
    const txt = locale.components.searchJournals;

    const handleSnackbarOpen = () => {
        setSnackbarNotify(true);
    };
    const handleSnackbarClose = (event, reason) => {
        /* istanbul ignore next */
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarNotify(false);
    };
    React.useEffect(() => {
        if (!showInputControls && hasAnySelectedKeywords && initialSelectedKeywords.current !== selectedKeywords) {
            handleSnackbarOpen();
        }
    }, [showInputControls, hasAnySelectedKeywords, selectedKeywords]);

    return (
        <StandardCard style={{ padding: 16 }} noHeader standardCardId="journal-search-card">
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
                message={txt.snackbar.message}
                role="alert"
            />
            <Grid container spacing={2} sx={{ position: 'relative' }}>
                {showInputControls && (
                    <Grid item xs={12} id={`${id}-search-input`} data-testid={`${id}-search-input`}>
                        <JournalSearchInput onReset={handleKeywordReset} />
                    </Grid>
                )}
                {hasAnySelectedKeywords && (
                    <Grid
                        item
                        xs={12}
                        id={`${id}-selected-keywords`}
                        data-testid={`${id}-selected-keywords`}
                        style={{ paddingRight: 48 }}
                    >
                        <SelectedKeywords
                            onKeywordDelete={handleKeywordDelete}
                            keywords={Object.values(selectedKeywords)}
                        />
                        {!showInputControls && (
                            <AddToSelectedSubjects onAdd={handleKeywordAdd} selected={selectedKeywords} />
                        )}
                    </Grid>
                )}
                {hasAnySelectedKeywords && !showInputControls && (
                    <Tooltip
                        id="strategic-publishing-clear-search"
                        data-testid="strategic-publishing-clear-search"
                        title={'Click to start a new search'}
                    >
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 0 }}
                            color="secondary"
                            aria-label="Clear search keywords"
                            component="span"
                            onClick={handleKeywordReset}
                            id="journal-search-clear-keywords-button"
                            data-testid="journal-search-clear-keywords-button"
                            data-analyticsid="journal-search-clear-keywords-button"
                            size="large"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {showInputControls && (
                    <Grid item xs={12} id={`${id}-keywords-browser`} data-testid={`${id}-keywords-browser`}>
                        <KeywordsBrowser
                            onKeywordAdd={handleKeywordAdd}
                            onKeywordDelete={handleKeywordDelete}
                            selectedKeywords={selectedKeywords}
                        />
                    </Grid>
                )}
                {showInputControls && (
                    <Grid item xs={12}>
                        <Grid container spacing={2} justifyContent="flex-end">
                            <CommonButtons onSearchAll={onSearchAll} />
                            <Grid item xs={12} sm="auto">
                                <Button
                                    disabled={!hasAnySelectedKeywords}
                                    variant="contained"
                                    children={txt.journalSearchInterface.buttons.searchJournals.title}
                                    aria-label={txt.journalSearchInterface.buttons.searchJournals.aria}
                                    type="submit"
                                    color="primary"
                                    onClick={onSearch}
                                    id="journal-search-button"
                                    data-testid="journal-search-button"
                                    data-analyticsid="journal-search-button"
                                    fullWidth
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
    onSearchAll: PropTypes.func,
    onFavourite: PropTypes.func,
    selectedKeywords: PropTypes.object,
    handleKeywordAdd: PropTypes.func,
    handleKeywordDelete: PropTypes.func,
    handleKeywordReset: PropTypes.func,
    hasAnySelectedKeywords: PropTypes.bool,
    showInputControls: PropTypes.bool,
};

export default React.memo(JournalSearchInterface);
