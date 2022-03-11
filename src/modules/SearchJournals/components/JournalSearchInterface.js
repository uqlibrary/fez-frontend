import React from 'react';
import PropTypes from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import JournalSearchInput from './JournalSearchInput';
import SelectedKeywords from './SelectedKeywords';
import KeywordsBrowser from './KeywordsBrowser';
import Snackbar from '@material-ui/core/Snackbar';
import locale from 'locale/components';
import { CommonButtons } from 'modules/SharedComponents/JournalsCommonButtons';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';

export const id = 'journal-search-interface';

const useStyles = makeStyles(theme => ({
    gridContainerSelectedKeywords: {
        width: '100%',
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: '1fr 40px',
        padding: theme.spacing(1),
    },
    closeButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    closeButton: {
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },
    },
}));

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

    const classes = useStyles();

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
            <Grid container spacing={2}>
                {showInputControls && (
                    <Grid item xs={12} id={`${id}-search-input`} data-testid={`${id}-search-input`}>
                        <JournalSearchInput onReset={handleKeywordReset} />
                    </Grid>
                )}
                {hasAnySelectedKeywords && (
                    <div className={classes.gridContainerSelectedKeywords}>
                        <Grid item xs={12} id={`${id}-selected-keywords`} data-testid={`${id}-selected-keywords`}>
                            <SelectedKeywords
                                onKeywordDelete={handleKeywordDelete}
                                keywords={Object.values(selectedKeywords)}
                            />
                        </Grid>
                        {!showInputControls && (
                            <Grid item xs={12} className={classes.closeButtonContainer}>
                                <Tooltip
                                    id="strategic-publishing-clear-search"
                                    data-testid="strategic-publishing-clear-search"
                                    title={'Click to clear search keywords'}
                                >
                                    <IconButton
                                        className={classes.closeButton}
                                        color="secondary"
                                        aria-label="Clear search keywords"
                                        component="span"
                                        onClick={handleKeywordReset}
                                        id="journal-search-clear-keywords-button"
                                        data-testid="journal-search-clear-keywords-button"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        )}
                    </div>
                )}
                {showInputControls && (
                    <Grid item xs={12} id={`${id}-keywords-browser`} data-testid={`${id}-keywords-browser`}>
                        <KeywordsBrowser onKeywordAdd={handleKeywordAdd} />
                    </Grid>
                )}
                {showInputControls && (
                    <Grid item xs={12}>
                        <Grid container spacing={2} justify="flex-end">
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
