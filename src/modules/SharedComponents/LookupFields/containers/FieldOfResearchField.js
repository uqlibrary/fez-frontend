import {AutoSuggestField} from 'uqlibrary-react-toolbox/build/AutoSuggestField';
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
        dataSourceConfig: { text: 'value', value: 'key'}
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (category) => dispatch(actions.loadVocabulariesList(category))
    }
);

export const FieldOfResearchField = connect(mapStateToProps, mapDispatchToProps)(AutoSuggestField);

