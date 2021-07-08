import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { loadJournalSearchKeywords } from 'actions';

import locale from 'locale/components';

export const JournalSearchInput = () => {
    const txt = locale.components.journalSearch;
    const dispatch = useDispatch();

    // const loadingJournalSearchKeywords = useSelector(
    //     state => (state.get('journalSearchReducer') || {}).loadingJournalSearchKeywords,
    // );

    /**
     * Journal search input handler
     *
     * @param {object} event keypress event object
     * @returns {Promise}
     * @todo Implement throttling
     */
    const handleJournalSearchInput = event => dispatch(loadJournalSearchKeywords(event.target.value));

    return (
        <TextField
            textFieldId="journal-search-keywords"
            placeholder={txt.input.placeholder}
            name="journal-search-keywords-input"
            onChange={handleJournalSearchInput}
            fullWidth
        />
    );
};

JournalSearchInput.propTypes = {
    initialValue: PropTypes.string,
};

export default React.memo(JournalSearchInput);
