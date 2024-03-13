import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'throttle-debounce';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { clearJournalSearchKeywords, loadJournalSearchKeywords } from 'actions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import locale from 'locale/components';
import { VoiceToText } from './partials/voiceToText';
import Tooltip from '@mui/material/Tooltip';

export const JournalSearchInput = ({ initialValue = '', onReset }) => {
    const txt = locale.components.searchJournals;
    const dispatch = useDispatch();
    const [journalSearchInput, setJournalSearchInput] = React.useState(initialValue);
    const loadingJournalSearchKeywords = useSelector(
        state => state.get('journalReducer')?.journalSearchKeywordsLoading,
    );
    const isInit = React.useRef(true);

    const throttledLoadSuggestions = React.useRef(
        throttle(2000, newValue => {
            dispatch(loadJournalSearchKeywords(newValue));
        }),
    );
    /**
     * Journal search input handler
     *
     * @param {object} event keypress event object
     */
    const handleJournalSearchInput = React.useCallback(event => setJournalSearchInput(event.target.value), []);
    /* istanbul ignore next */
    const handleJournalVoiceSearchInput = React.useCallback(value => !!value && setJournalSearchInput(value), []);
    const handleClearSearchInput = React.useCallback(() => {
        onReset();
        setJournalSearchInput('');
        dispatch(clearJournalSearchKeywords());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (journalSearchInput && journalSearchInput.length > 2 && throttledLoadSuggestions) {
            setTimeout(() => {
                throttledLoadSuggestions.current(journalSearchInput);
                window.dataLayer.push({
                    event: 'Typed',
                    value: journalSearchInput,
                    label: 'Journal search keywords',
                    'data-testid': 'journal-search-keywords-input',
                });
            }, 1000);
        } else {
            // dispatch fires when component remounts i.e. from results page back to search input
            /* istanbul ignore next */
            !isInit && dispatch(clearJournalSearchKeywords());
            isInit.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journalSearchInput]);

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} style={{ padding: '10px 0 0 0' }}>
                <Typography>
                    <b>{txt.journalSearchInput.titlePrefix}</b>&nbsp;{txt.journalSearchInput.title}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    autoFocus
                    textFieldId="journal-search-keywords"
                    placeholder={txt.input.placeholder}
                    ariaLabel={`${txt.input.aria_label} ${txt.input.placeholder}`}
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
                                    <VoiceToText sendHandler={handleJournalVoiceSearchInput} />
                                    <Tooltip
                                        id="strategic-publishing-voice-record"
                                        data-testid="strategic-publishing-voice-record"
                                        title={'Click to clear search keywords'}
                                    >
                                        <IconButton
                                            style={{ marginRight: -12 }}
                                            color="secondary"
                                            aria-label="Clear search keyword input"
                                            component="span"
                                            onClick={handleClearSearchInput}
                                            disabled={!journalSearchInput.length}
                                            id="clear-journal-search-keywords"
                                            data-analyticsid="clear-journal-search-keywords"
                                            data-testid="clear-journal-search-keywords"
                                            size="large"
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Tooltip>
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
    onReset: PropTypes.func,
};

export default React.memo(JournalSearchInput);
