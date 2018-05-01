import {AutoSuggestField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import {FieldOfResearchVocabId} from 'config/general';
import {connect} from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    return {
        category: FieldOfResearchVocabId,
        onChange: props.input.onChange,
        errorText: props.meta ? props.meta.error : props.errorText,
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId]
            ? state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId].itemsKeyValueList : [],
        dataSourceConfig: { text: 'value', value: 'key'},
        selectedValue: props.input ? props.input.value : null,
        maxResults: props.maxResults,
        filter: props.filter || null
    };
};

const filterFoRmapStateToProps = (state, props) => {
    return {
        category: FieldOfResearchVocabId,
        onChange: props.input.onChange,
        errorText: props.meta ? props.meta.error : props.errorText,
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId]
            ? state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId].itemsKeyValueList : [],
        dataSourceConfig: { text: 'value', value: 'key'},
        selectedValue: props.input ? props.input.value : null,
        maxResults: 20,
        filter: (searchText, key) => {
            if (searchText === '') return false;
            const testKey = new RegExp(`(?=^[\\d]{4}\\s.+).*${searchText}.*`, 'gi');
            return testKey.test(key);
        }
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (category) => dispatch(actions.loadVocabulariesList(category))
    }
);

export const FieldOfResearchField = connect(mapStateToProps, mapDispatchToProps)(AutoSuggestField);
export const FilteredFieldOfResearchField = connect(filterFoRmapStateToProps, mapDispatchToProps)(AutoSuggestField);

