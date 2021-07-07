import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { loadJournalSearchKeywords } from 'actions';

import locale from 'locale/components';

export const JournalSearchInput = ({ initialValue }) => {
    const txt = locale.components.journalSearch;
    const dispatch = useDispatch();

    const loadingJournalSearchKeywords = useSelector(
        state => (state.get('journalSearchReducer') || {}).loadingJournalSearchKeywords,
    );

    const handleJournalSearchInput = searchQuery => dispatch(loadJournalSearchKeywords(searchQuery));

    return (
        <AutoCompleteAsynchronousField
            autoCompleteAsynchronousFieldId="journal-search-keywords"
            defaultValue={initialValue || ''}
            getOptionLabel={f => f}
            itemsLoading={loadingJournalSearchKeywords || false}
            itemsList={[]}
            loadSuggestions={handleJournalSearchInput}
            placeholder={txt.input.placeholder}
            filterOptions={() => {}}
        />
    );
};

JournalSearchInput.propTypes = {
    initialValue: PropTypes.string,
};

export default React.memo(JournalSearchInput);
