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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import locale from 'locale/components';
import { VoiceToText } from './partials/voiceToText';

export const JournalSearchInput = () => {
    const txt = locale.components.journalSearch;
    const dispatch = useDispatch();
    const [journalSearchInput, setJournalSearchInput] = React.useState('');
    const loadingJournalSearchKeywords = useSelector(
        state => (state.get('journalReducer') || {}).journalSearchKeywordsLoading,
    );

    const throttledLoadSuggestions = React.useRef(
        throttle(2000, newValue => dispatch(loadJournalSearchKeywords(newValue))),
    );
    /**
     * Journal search input handler
     *
     * @param {object} event keypress event object
     */
    const handleJournalSearchInput = React.useCallback(event => setJournalSearchInput(event.target.value), []);
    const handleJournalVoiceSearchInput = React.useCallback(value => !!value && setJournalSearchInput(value), []);
    const handleClearSearchInput = React.useCallback(() => {
        setJournalSearchInput('');
        dispatch(clearJournalSearchKeywords());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (journalSearchInput && journalSearchInput.length > 2 && throttledLoadSuggestions) {
            const timeOutId = setTimeout(() => {
                throttledLoadSuggestions.current(journalSearchInput);
            }, 1000);
            return () => clearTimeout(timeOutId);
        } else {
            dispatch(clearJournalSearchKeywords());
            return null;
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
                    autoFocus
                    textFieldId="journal-search-keywords"
                    placeholder={txt.input.placeholder}
                    name="journal-search-keywords-input"
                    autoComplete="off"
                    onChange={handleJournalSearchInput}
                    value={journalSearchInput}
                    fullWidth
                    InputProps={{
                        'data-testid': 'journal-search-keywords-input',
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
                                    <VoiceToText sendHandler={handleJournalVoiceSearchInput} />
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
