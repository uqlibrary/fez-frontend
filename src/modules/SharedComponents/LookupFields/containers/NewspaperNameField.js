/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';
import { matchSorter } from 'match-sorter';

const category = 'journal_name';

const NewspaperNameField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery));

    const { itemsList, itemsLoading } = useSelector(
        state => state.get('searchKeysReducer') && state.get('searchKeysReducer')[category],
    ) || { itemsList: [], itemsLoading: false };

    return (
        <AutoCompleteAsynchronousField
            {...props}
            id={props.id}
            autoCompleteAsynchronousFieldId={props.newspaperNameFieldId || 'rek-newspaper-name'}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            allowFreeText
            errorText={props.meta ? props.meta.error : null}
            error={props.meta ? !!props.meta.error : null}
            getOptionLabel={item => (!!item && String(item.value)) || ''}
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value'] })}
            floatingLabelText={props.floatingLabelText || 'Newspaper name'}
            loadSuggestions={loadSuggestions}
            onClear={() => props.onChange(null)}
        />
    );
};

NewspaperNameField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(NewspaperNameField);
