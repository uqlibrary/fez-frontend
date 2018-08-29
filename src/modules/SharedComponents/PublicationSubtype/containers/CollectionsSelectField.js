import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const translatedItemList = state.get('collectionsReducer') && state.get('collectionsReducer').itemsList.map((item, index) => {
        return {text: item.rek_title, value: item.rek_pid, index};
    });

    return {
        selectedValue: props.value,
        itemsList: translatedItemList || [],
        itemsLoading: state.get('collectionsReducer').itemsLoading || false,
        itemsLoadingError: state.get('collectionsReducer').itemsLoadingError || false,
        placeholder: state.get('collectionsReducer').itemsLoading ? props.loadingHint : props.hintText,
        error: state.get('collectionsReducer').itemsLoadingError ? props.errorHint : props.errorText,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loadItemsList: () => dispatch(actions.collectionsList())
    };
}

const CollectionsList = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

export default function CollectionsSelectField(fieldProps) {
    return (<CollectionsList { ...fieldProps } />);
}
