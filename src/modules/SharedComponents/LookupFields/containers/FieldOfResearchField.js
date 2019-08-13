import { AutoCompleteAsyncField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { FIELD_OF_RESEARCH_VOCAB_ID } from 'config/general';
import { connect } from 'react-redux';
import * as actions from 'actions';

export const escapeRegExp = text => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const mapStateToProps = (state, props) => {
    return {
        category: FIELD_OF_RESEARCH_VOCAB_ID,
        onChange: props.input.onChange,
        errorText: props.meta ? props.meta.error : props.errorText,
        error: props.meta ? !!props.meta.error : !!props.errorText || null,
        itemsList:
            state.get('controlledVocabulariesReducer') &&
            state.get('controlledVocabulariesReducer')[FIELD_OF_RESEARCH_VOCAB_ID]
                ? state.get('controlledVocabulariesReducer')[FIELD_OF_RESEARCH_VOCAB_ID].itemsKeyValueList
                : [],
        selectedValue: !!props.input && !!props.input.value ? { value: props.input.value } : null,
        maxResults: props.maxResults,
        async: true,
        itemToString: item => (!!item && String(item.value)) || '',
        filter:
            props.filter ||
            ((searchText, key) => {
                if (searchText === '') return false;
                return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
            }),
    };
};

const filterFoRmapStateToProps = (state, props) => {
    return {
        category: FIELD_OF_RESEARCH_VOCAB_ID,
        onChange: props.input.onChange,
        errorText: props.meta ? props.meta.error : props.errorText,
        error: props.meta ? !!props.meta.error : !!props.errorText || null,
        itemsList:
            state.get('controlledVocabulariesReducer') &&
            state.get('controlledVocabulariesReducer')[FIELD_OF_RESEARCH_VOCAB_ID]
                ? state.get('controlledVocabulariesReducer')[FIELD_OF_RESEARCH_VOCAB_ID].itemsKeyValueList
                : [],
        selectedValue: !!props.input && !!props.input.value ? { value: props.input.value } : null,
        maxResults: 20,
        async: true,
        itemToString: item => (!!item && String(item.value)) || '',
        filter: (searchText, key) => {
            if (searchText === '') return false;
            const textMatchKey =
                !!key &&
                key
                    .toString()
                    .toLowerCase()
                    .includes(!!searchText && searchText.toString().toLowerCase());
            const testKey = new RegExp(/^[0-9]{4}\s.*/gi); // Only return items from the list that match this regex of 4 digits, then a space, then anything
            return testKey.test(key.toString()) && textMatchKey;
        },
    };
};

const mapDispatchToProps = dispatch => ({
    loadSuggestions: category => {
        dispatch(actions.loadVocabulariesList(category));
    },
});

export const FieldOfResearchField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsyncField);
export const FilteredFieldOfResearchField = connect(
    filterFoRmapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsyncField);
