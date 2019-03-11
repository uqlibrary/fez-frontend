import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import {UNPUBLISHED_STATUS} from 'config/general';

export const mapStateToProps = (state, props) => {
    return {
        selectedValue: props.input ? props.input.value : props.value,
        itemsList: props.itemsList || UNPUBLISHED_STATUS,
        itemsLoading: false,
        hideLabel: props.hideLabel || false,
        label: props.label,
        placeholder: props.placeholder,
        required: props.required,
        errorText: !!props.meta && props.meta.error || props.error && !!props.errorText || '',
        error: !!props.meta && !!props.meta.error || props.error || false
    };
};

const mapDispatchToProps = () => {
    return {};
};

const UnpublishedStatusList = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

export default function UnpublishedStatusField(fieldProps) {
    return (<UnpublishedStatusList onChange={ !!fieldProps.input && fieldProps.input.onChange || !!fieldProps.onChange && fieldProps.onChange } { ...fieldProps } />);
}
