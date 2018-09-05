import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import {thesisSubtypes} from 'config/general';

const mapStateToProps = (state, props) => {
    return {
        selectedValue: props.input ? props.input.value : props.value,
        itemsList: props.itemsList || thesisSubtypes,
        itemsLoading: false,
        hideLabel: true
    };
};

const mapDispatchToProps = () => {
    return {};
};

const ThesisSubtypeList = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

export default function ThesisSubtypeField(fieldProps) {
    return (<ThesisSubtypeList onChange={ !!fieldProps.input && fieldProps.input.onChange || !!fieldProps.onChange && fieldProps.onChange } { ...fieldProps } />);
}
