import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import {general} from 'config';

const mapStateToProps = () => {
    return {
        itemsList: general.thesisSubtypes,
        itemsLoading: false
    };
};

const mapDispatchToProps = () => {
    return {};
};

const ThesisSubtypeList = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

export default function ThesisSubtypeField(fieldProps) {
    return (<ThesisSubtypeList onChange={ fieldProps.input.onChange } { ...fieldProps } />);
}
