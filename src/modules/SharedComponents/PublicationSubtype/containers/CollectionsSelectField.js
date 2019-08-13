import React from 'react';
import { connect } from 'react-redux';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading, itemsLoadingError } = state.get('collectionsReducer') || {};

    const translatedItemList = itemsList.map((item, index) => {
        return { text: item.rek_title, value: item.rek_pid, index };
    });

    return {
        selectedValue: props.value || [],
        itemsList: translatedItemList || [],
        itemsLoading,
        itemsLoadingError,
        itemsLoadingHint: props.loadingHint || 'Loading..',
        hideLabel: true,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loadItemsList: () => dispatch(actions.collectionsList()),
    };
}

const CollectionsList = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GenericSelectField);

export default function CollectionsSelectField(fieldProps) {
    return <CollectionsList {...fieldProps} />;
}
