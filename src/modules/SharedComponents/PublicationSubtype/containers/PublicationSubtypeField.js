import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';

const mapStateToProps = (state, ownProps) => {
    return {
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[ownProps.vocabId]
            ? state.get('controlledVocabulariesReducer')[ownProps.vocabId].itemsList : [],
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
    return (<PublicationSubtypeList onChange={ fieldProps.input.onChange } parentItemsId={fieldProps.vocabId} { ...fieldProps } />);
}
