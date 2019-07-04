import React from 'react';
import { connect } from 'react-redux';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { THESIS_SUBTYPES } from 'config/general';

const mapStateToProps = (state, props) => {
    return {
        selectedValue: props.input ? props.input.value : props.value,
        itemsList: props.itemsList || THESIS_SUBTYPES,
        itemsLoading: false,
        hideLabel: props.hideLabel || false,
        label: props.label || (props.locale && props.locale.label) || '',
        placeholder: props.placeholder,
        required: props.required,
        itemsLoadingHint: props.loadingHint || 'Loading..',
        errorText: (!!props.meta && props.meta.error) || (props.error && !!props.errorText && props.errorText) || '',
        error: (!!props.meta && !!props.meta.error) || props.error || false,
    };
};

const mapDispatchToProps = () => {
    return {};
};

const ThesisSubtypeList = connect(
    mapStateToProps,
    mapDispatchToProps
)(GenericSelectField);

export default function ThesisSubtypeField(fieldProps) {
    return (
        <ThesisSubtypeList
            onChange={
                (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange)
            }
            {...fieldProps}
        />
    );
}
