import {AutoCompleteAsyncField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import {FieldOfResearchVocabId} from 'config/general';
import {connect} from 'react-redux';
import * as actions from 'actions';

export const escapeRegExp = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const mapStateToProps = (state, props) => {
    return {
        category: FieldOfResearchVocabId,
        onChange: props.input.onChange,
        errorText: props.meta ? props.meta.error : props.errorText,
        error: props.meta ? !!props.meta.error : !!props.errorText || null,
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId]
            ? state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId].itemsKeyValueList : [],
        selectedValue: props.input ? {value: props.input.value} : null,
        maxResults: props.maxResults,
        async: true,
        itemToString: (item) => !!item && String(item.value) || '',
        filter: props.filter || ((searchText, key) => {
            return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
        })
    };
};

const filterFoRmapStateToProps = (state, props) => {
    return {
        category: FieldOfResearchVocabId,
        onChange: props.input.onChange,
        errorText: props.meta ? props.meta.error : props.errorText,
        error: props.meta ? !!props.meta.error : !!props.errorText || null,
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId]
            ? state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId].itemsKeyValueList : [],
        selectedValue: props.input ? props.input.value : null,
        maxResults: 20,
        async: true,
        itemToString: (item) => !!item && String(item.value) || '',
        filter: (searchText, key) => {
            if (searchText === '') return false;
            const testKey = new RegExp(`(?=^[\\d]{4}\\s.+).*${escapeRegExp(searchText)}.*`, 'gi');
            return testKey.test(key);
        }
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (category) => dispatch(actions.loadVocabulariesList(category))
    }
);

export const FieldOfResearchField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);
export const FilteredFieldOfResearchField = connect(filterFoRmapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

