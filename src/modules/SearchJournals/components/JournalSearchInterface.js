import React from 'react';
import PropTypes from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import JournalSearchInput from './JournalSearchInput';
import SelectedKeywords from './SelectedKeywords';
import KeywordsBrowser from './KeywordsBrowser';
import Snackbar from '@material-ui/core/Snackbar';
import locale from 'locale/components';
import { CommonButtons } from 'modules/SharedComponents/JournalsCommonButtons';

export const JournalSearchInterface = ({
    onSearch,
    selectedKeywords,
    setSelectedKeywords,
    handleKeywordAdd,
    handleKeywordDelete,
    hasAnySelectedKeywords,
    showInputControls,
}) => {
    const [snackbarNotify, setSnackbarNotify] = React.useState(false);
    const initialSelectedKeywords = React.useRef(selectedKeywords);

    const txt = locale.components.journalSearch;

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
        if (!showInputControls && hasAnySelectedKeywords && initialSelectedKeywords.current !== selectedKeywords) {
            handleSnackbarOpen();
        }
    }, [showInputControls, hasAnySelectedKeywords, selectedKeywords]);
    return (
        <StandardCard style={{ padding: 16 }} noHeader id="journal-search-card" data-testid="journal-search-card">
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
                {showInputControls && (
                    <Grid item xs={12}>
                        <JournalSearchInput onReset={() => setSelectedKeywords({})} />
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
                {showInputControls && (
                    <Grid item xs={12}>
                        <KeywordsBrowser onKeywordAdd={handleKeywordAdd} />
                    </Grid>
                )}
                {showInputControls && (
                    <Grid item xs={12}>
                        <Grid container spacing={2} justify="flex-end">
                            <CommonButtons />
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
    onFavourite: PropTypes.func,
    selectedKeywords: PropTypes.object,
    setSelectedKeywords: PropTypes.func,
    handleKeywordAdd: PropTypes.func,
    handleKeywordDelete: PropTypes.func,
    hasAnySelectedKeywords: PropTypes.bool,
    showInputControls: PropTypes.bool,
};

export default React.memo(JournalSearchInterface);
