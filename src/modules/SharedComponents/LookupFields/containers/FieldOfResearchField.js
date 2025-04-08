/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { FIELD_OF_RESEARCH_VOCAB_ID } from 'config/general';

import * as actions from 'actions';
import { matchSorter } from 'match-sorter';
import { FoROptionTemplate } from 'modules/SharedComponents/LookupFields';

const category = FIELD_OF_RESEARCH_VOCAB_ID;

const FieldOfResearch = props => {
    const dispatch = useDispatch();
    const { itemsKeyValueList, itemsLoading } = useSelector(
        state =>
            state.get('controlledVocabulariesReducer') &&
            state.get('controlledVocabulariesReducer')[props.category || category],
    ) || {
        itemsKeyValueList: [],
        itemsLoading: false,
    };
    const loadSuggestions = () => dispatch(actions.loadVocabulariesList(props.category || category));

    return (
        <AutoCompleteAsynchronousField
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value'] })}
            id="field-of-research-field-input"
            {...props}
            autoCompleteAsynchronousFieldId={'rek-subject'}
            onClear={() => {}}
            errorText={props.state ? props.state.error : props.errorText}
            error={props.state ? !!props.state.error : !!props.error || null}
            itemsList={itemsKeyValueList}
            itemsLoading={itemsLoading}
            defaultValue={!!props && !!props.value ? { value: props.value } : null}
            getOptionLabel={() => ''}
            OptionTemplate={FoROptionTemplate}
            loadSuggestions={loadSuggestions}
        />
    );
};

const FilteredFieldOfResearch = props => {
    return (
        <FieldOfResearch
            {...props}
            filterOptions={(options, { inputValue }) => {
                return options.filter(option => {
                    const textMatchKey =
                        !!option.value &&
                        option.value
                            .toString()
                            .toLowerCase()
                            .includes(!!inputValue && inputValue.toString().toLowerCase());
                    const testKey = new RegExp(/^[0-9]{4}\s.*/gi); // Only return items from the list that match this regex of 4 digits, then a space, then anything
                    return testKey.test(option.value.toString()) && textMatchKey;
                });
            }}
            id="filtered-field-of-research-input"
        />
    );
};

FieldOfResearch.propTypes = {
    props: PropTypes.object,
};
FilteredFieldOfResearch.propTypes = {
    props: PropTypes.object,
};

const FieldOfResearchField = React.memo(FieldOfResearch);
const FilteredFieldOfResearchField = React.memo(FilteredFieldOfResearch);

export { FieldOfResearchField, FilteredFieldOfResearchField };
