import React from 'react';
import PublicationSubtypeForm from '../containers/PublicationSubtypeForm';

export default function PublicationSubtype(fieldProps) {
    return (<PublicationSubtypeForm onChange={ fieldProps.input.onChange } { ...fieldProps } />);
}
