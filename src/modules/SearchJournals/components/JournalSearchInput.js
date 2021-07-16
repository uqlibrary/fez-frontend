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
    const handleJournalSearchInput = React.useCallback(event => setJournalSearchInput(event.target.value.trim()), []);
    const handleClearSearchInput = React.useCallback(() => {
        setJournalSearchInput('');
        dispatch(clearJournalSearchKeywords());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (journalSearchInput && journalSearchInput.length > 3 && throttledLoadSuggestions) {
            throttledLoadSuggestions.current(journalSearchInput);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journalSearchInput]);

    return (
        <TextField
            textFieldId="journal-search-keywords"
            placeholder={txt.input.placeholder}
            name="journal-search-keywords-input"
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
    );
};

JournalSearchInput.propTypes = {
    initialValue: PropTypes.string,
};

export default React.memo(JournalSearchInput);
