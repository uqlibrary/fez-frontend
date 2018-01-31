import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import {thesisSubtypes} from 'config/general';

const mapStateToProps = (state, props) => {
    return {
        itemsList: thesisSubtypes,
        itemsLoading: false,
        selectedValue: props.input ? props.input.value : null
    };
};

const mapDispatchToProps = () => {
    return {};
};

const ThesisSubtypeList = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

export default function ThesisSubtypeField(fieldProps) {
    return (<ThesisSubtypeList onChange={ fieldProps.input.onChange } { ...fieldProps } />);
}
