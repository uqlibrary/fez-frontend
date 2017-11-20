import React from 'react';
import {connect} from 'react-redux';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import {openAccessIdLookup} from 'config/general';

const mapStateToProps = () => {
    return {
        itemsList: openAccessIdLookup,
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
