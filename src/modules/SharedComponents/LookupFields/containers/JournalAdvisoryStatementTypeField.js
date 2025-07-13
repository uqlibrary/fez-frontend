/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { matchSorter } from 'match-sorter';
import { GenericOptionTemplate } from 'modules/SharedComponents/LookupFields';

const JournalAdvisoryStatementTypeField = props => {
    return (
        <AutoCompleteAsynchronousField
            {...props}
            autoCompleteAsynchronousFieldId={props.id}
            errorText={props.meta?.error ? props.meta.error : props.errorText}
            error={!!props.meta?.error}
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value', 'id'] })}
            itemsList={props.list.items}
            itemsLoading={props.list.itemsLoading}
            defaultValue={props.value && props.list.items.find(item => item.key === props.value)}
            getOptionLabel={item => item.value || ''}
            OptionTemplate={GenericOptionTemplate}
            onClear={() => props.onChange(null)}
            clearSuggestionsOnClose={false}
            loadSuggestions={props.list.fetch}
            onChange={item => props.onChange(item.key)}
        />
    );
};

JournalAdvisoryStatementTypeField.propTypes = {
    props: PropTypes.object,
};

export default JournalAdvisoryStatementTypeField;
