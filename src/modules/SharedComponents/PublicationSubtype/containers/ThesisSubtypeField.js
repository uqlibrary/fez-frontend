import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import {thesisSubtypes} from 'config/general';

const mapStateToProps = (state, props) => {
    return {
        selectedValue: props.input ? props.input.value : props.value,
        itemsList: props.itemsList || thesisSubtypes,
        itemsLoading: false,
        hideLabel: props.hideLabel || false,
        label: props.label,
        placeholder: props.placeholder,
        required: props.required,
        itemsLoadingHint: props.loadingHint || 'Loading..',
        errorText: props.meta.error,
        error: !!props.meta.error
    };
};

const mapDispatchToProps = () => {
    return {};
};

const ThesisSubtypeList = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

export default function ThesisSubtypeField(fieldProps) {
    return (<ThesisSubtypeList onChange={ !!fieldProps.input && fieldProps.input.onChange || !!fieldProps.onChange && fieldProps.onChange } { ...fieldProps } />);
}
