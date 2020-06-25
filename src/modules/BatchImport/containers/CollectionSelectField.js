import React from 'react';
import { connect } from 'react-redux';

import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';

import { TOP_LEVEL_SECURITY_POLICIES } from 'config/general';

const mapStateToProps = (state, props) => {
    const itemsList = state.get('collectionsReducer').itemsList.map(item => {
        const securityPolicy = TOP_LEVEL_SECURITY_POLICIES.find(policy => policy.id === item.rek_security_policy);
        return { text: `${item.rek_title} (${securityPolicy.label})`, value: item.rek_pid, index: item.rek_pid };
    });
    return {
        value: props.input.value || '',
        itemsList,
        itemsLoadingHint: props.loadingHint || 'Loading..',
    };
};

const CollectionSelect = connect(mapStateToProps)(GenericSelectField);

const _onChange = fieldProps => {
    return (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange);
};

export default function CollectionSelectField(fieldProps) {
    return <CollectionSelect onChange={_onChange(fieldProps)} genericSelectFieldId="collection-pid" {...fieldProps} />;
}
