import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { FIELD_OF_RESEARCH_VOCAB_ID } from 'config/general';
import { connect } from 'react-redux';
import * as actions from 'actions';
import matchSorter from 'match-sorter';
import { FoROptionTemplate } from 'modules/SharedComponents/LookupFields';

const category = FIELD_OF_RESEARCH_VOCAB_ID;

const mapStateToProps = (state, props) => {
    const { itemsKeyValueList, itemsLoading } = (state.get('controlledVocabulariesReducer') &&
        state.get('controlledVocabulariesReducer')[props.category || category]) || {
        itemsKeyValueList: [],
        itemsLoading: false,
    };
    return {
        autoCompleteAsynchronousFieldId: 'rek-subject',
        onChange: props.input.onChange,
        onClear: () => {},
        errorText: props.meta ? props.meta.error : props.errorText,
        error: props.meta ? !!props.meta.error : !!props.error || null,
        itemsList: itemsKeyValueList,
        itemsLoading,
        defaultValue: !!props.input && !!props.input.value ? { value: props.input.value } : null,
        getOptionLabel: () => '',
        filterOptions: (options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value'] }),
        OptionTemplate: FoROptionTemplate,
        id: 'field-of-research-field-input',
    };
};

const filterFoRmapStateToProps = (state, props) => {
    const { itemsKeyValueList, itemsLoading } = (state.get('controlledVocabulariesReducer') &&
        state.get('controlledVocabulariesReducer')[props.category || category]) || {
        itemsKeyValueList: [],
        itemsLoading: false,
    };

    return {
        autoCompleteAsynchronousFieldId: 'rek-subject',
        onChange: props.input.onChange,
        onClear: () => {},
        errorText: props.meta ? props.meta.error : props.errorText,
        error: props.meta ? !!props.meta.error : !!props.error || null,
        itemsList: itemsKeyValueList,
        itemsLoading,
        defaultValue: !!props.input && !!props.input.value ? { value: props.input.value } : null,
        getOptionLabel: () => '',
        filterOptions: (options, { inputValue }) => {
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
        },
        OptionTemplate: FoROptionTemplate,
        id: 'filtered-field-of-research-input',
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: () => {
        dispatch(actions.loadVocabulariesList(props.category || category));
    },
});

export const FieldOfResearchField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);

export const FilteredFieldOfResearchField = connect(
    filterFoRmapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsynchronousField);
