import React from 'react';
import { connect } from 'react-redux';

import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';

const mapStateToProps = (state, props) => {
    const itemsList = state.get('collectionsReducer').itemsList.map((item, index) => {
        return { text: item.rek_title, value: item.rek_pid, index: index + 1 };
    });
    return {
        selectedValue: props.input.value || [],
        itemsList,
        itemsLoadingHint: props.loadingHint || 'Loading..',
    };
};

const CollectionSelect = connect(mapStateToProps)(GenericSelectField);

const _onChange = fieldProps => {
    return (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange);
};

export default function CollectionSelectField(fieldProps) {
    return <CollectionSelect onChange={_onChange(fieldProps)} {...fieldProps} />;
}
