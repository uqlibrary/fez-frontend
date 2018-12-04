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
        selectedValue: !!props.input && !!props.input.value ? {value: props.input.value} : null,
        maxResults: props.maxResults,
        async: true,
        itemToString: (item) => !!item && String(item.value) || '',
        filter: props.filter || ((searchText, key) => {
            if (searchText === '') return false;
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
        selectedValue: !!props.input && !!props.input.value ? {value: props.input.value} : null,
        maxResults: 20,
        async: true,
        itemToString: (item) => !!item && String(item.value) || '',
        filter: (searchText, key) => {
            if (searchText === '') return false;
            const textMatchKey = !!key && key.toLowerCase().includes(!!searchText && searchText.toLowerCase());
            return textMatchKey;
        }
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (category) => {
            dispatch(actions.loadVocabulariesList(category));
        }
    }
);

export const FieldOfResearchField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);
export const FilteredFieldOfResearchField = connect(filterFoRmapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

