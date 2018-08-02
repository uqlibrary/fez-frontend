import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';
import {publicationSubtypes} from 'config/general';

const mapStateToProps = (state, ownProps) => {
    return {
        selectedValue: !!ownProps.input && ownProps.input.value || ownProps.value,
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[ownProps.vocabId]
            ? state.get('controlledVocabulariesReducer')[ownProps.vocabId].itemsList : publicationSubtypes,
        itemsLoading: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[ownProps.vocabId]
            ? state.get('controlledVocabulariesReducer')[ownProps.vocabId].itemsLoading : false
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadItemsList: (category) => dispatch(actions.loadVocabulariesList(category))
    };
};

const PublicationSubtypeList = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

export default function PublicationSubtypeField(fieldProps) {
    return (<PublicationSubtypeList onChange={!!fieldProps.input && fieldProps.input.onChange || !!fieldProps.onChange && fieldProps.onChange} parentItemsId={fieldProps.vocabId} { ...fieldProps } />);
}
