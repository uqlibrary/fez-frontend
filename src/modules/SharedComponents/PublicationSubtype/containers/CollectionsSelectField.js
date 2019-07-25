import React from 'react';
import { connect } from 'react-redux';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading, itemsLoadingError } = state.get('collectionsReducer') || {};

    const translatedItemList = itemsList.map((item, index) => {
        return { text: item.rek_title, value: item.rek_pid, index: index + 1 };
    });

    return {
        selectedValue: props.input.value || [],
        itemsList: translatedItemList || [],
        itemsLoading,
        itemsLoadingError,
        itemsLoadingHint: props.loadingHint || 'Loading..',
        hideLabel: !props.parentPid,
        parentPid: props.parentPid,
    };
};

function mapDispatchToProps(dispatch, props) {
    if (!props.parentPid) {
        return {
            loadItemsList: () => dispatch(actions.collectionsList()),
        };
    }

    dispatch(actions.collectionsList(props.parentPid));
    return {
        loadItemsList: () => dispatch(actions.collectionsList(props.parentPid)),
    };
}

const CollectionsList = connect(
    mapStateToProps,
    mapDispatchToProps
)(GenericSelectField);

const _onChange = fieldProps => {
    return (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange);
};

export default function CollectionsSelectField(fieldProps) {
    return <CollectionsList onChange={_onChange(fieldProps)} {...fieldProps} />;
}
