/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';
import { matchSorter } from 'match-sorter';
import { FoROptionTemplate } from 'modules/SharedComponents/LookupFields';

const Field = props => {
    const dispatch = useDispatch();
    const { rawData, itemsKeyValueList, itemsLoading } = useSelector(
        state =>
            state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[props.category],
    ) || {
        rawData: [],
        itemsKeyValueList: [],
        itemsLoading: false,
    };
    // Note: it will send reqs. to API on every key stroke on DEV mode
    const loadSuggestions = () => dispatch(actions.loadVocabulariesList(props.category));

    return (
        <AutoCompleteAsynchronousField
            filterOptions={
                props.filterOptions ||
                ((options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value'] }))
            }
            {...props}
            onChange={props.onChange || props.input.onChange}
            onClear={() => {}}
            errorText={props.meta ? props.meta.error : props.errorText}
            error={props.meta ? !!props.meta.error : !!props.error || null}
            itemsList={props.dataTransformer ? props.dataTransformer(rawData) : itemsKeyValueList}
            itemsLoading={itemsLoading}
            defaultValue={!!props.input && !!props.input.value ? { value: props.input.value } : null}
            getOptionLabel={props.getOptionLabel || (() => '')}
            OptionTemplate={FoROptionTemplate}
            loadSuggestions={loadSuggestions}
        />
    );
};

Field.propTypes = {
    props: PropTypes.shape({
        id: PropTypes.string.isRequired,
        category: PropTypes.number.isRequired,
        autoCompleteAsynchronousFieldId: PropTypes.string.isRequired,
        filterOptions: PropTypes.func,
        dataTransformer: PropTypes.func,
        onChange: PropTypes.func,
        ...PropTypes.any,
    }),
};

export const ControlledAutoCompleteAsynchronousField = React.memo(Field);
