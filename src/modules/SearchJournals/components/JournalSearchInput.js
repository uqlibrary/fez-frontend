import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'throttle-debounce';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { loadJournalSearchKeywords, clearJournalSearchKeywords } from 'actions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MicIcon from '@material-ui/icons/Mic';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import locale from 'locale/components';

export const JournalSearchInput = () => {
    const txt = locale.components.journalSearch;
    const dispatch = useDispatch();
    const [journalSearchInput, setJournalSearchInput] = React.useState('');

    const loadingJournalSearchKeywords = useSelector(
        state => (state.get('journalReducer') || {}).journalSearchKeywordsLoading,
    );

    const throttledLoadSuggestions = React.useRef(
        throttle(1000, newValue => dispatch(loadJournalSearchKeywords(newValue))),
    );
    /**
     * Journal search input handler
     *
     * @param {object} event keypress event object
     */
    const handleJournalSearchInput = React.useCallback(event => setJournalSearchInput(event.target.value), []);
    const handleClearSearchInput = React.useCallback(() => {
        setJournalSearchInput('');
        dispatch(clearJournalSearchKeywords());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (journalSearchInput && journalSearchInput.length > 2 && throttledLoadSuggestions) {
            setTimeout(throttledLoadSuggestions.current(journalSearchInput), 500);
        } else {
            dispatch(clearJournalSearchKeywords());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journalSearchInput]);

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} style={{ padding: '10px 0 0 0' }}>
                <Typography>
                    <b>Step 1.</b> Enter a journal title, keyword, subject or field of research code.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    textFieldId="journal-search-keywords"
                    placeholder={txt.input.placeholder}
                    name="journal-search-keywords-input"
                    autoComplete="off"
                    onChange={handleJournalSearchInput}
                    value={journalSearchInput}
                    fullWidth
                    InputProps={{
                        ...((!!loadingJournalSearchKeywords && {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CircularProgress
                                        size={18}
                                        thickness={2}
                                        color="primary"
                                        id="loading-journal-search-keywords"
                                        data-testid="loading-journal-search-keywords"
                                    />
                                </InputAdornment>
                            ),
                        }) || {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        style={{ marginRight: -18 }}
                                        color="secondary"
                                        aria-label="Enter search keyword by voice"
                                        component="span"
                                        id="voice-to-text-keywords"
                                        data-testid="voice-to-text-keywords"
                                    >
                                        <MicIcon />
                                    </IconButton>
                                    <IconButton
                                        style={{ marginRight: -12 }}
                                        color="secondary"
                                        aria-label="Clear search keyword input"
                                        component="span"
                                        onClick={handleClearSearchInput}
                                        id="clear-journal-search-keywords"
                                        data-testid="clear-journal-search-keywords"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }),
                    }}
                />
            </Grid>
        </Grid>
    );
};

JournalSearchInput.propTypes = {
    initialValue: PropTypes.string,
};

export default React.memo(JournalSearchInput);
