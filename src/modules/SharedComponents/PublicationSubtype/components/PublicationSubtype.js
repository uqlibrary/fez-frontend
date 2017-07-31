import React from 'react';
import PublicationSubtypeForm from './PublicationSubtypeForm';

export default function PublicationSubtype(fieldProps) {
    return (<PublicationSubtypeForm onChange={ fieldProps.input.onChange } { ...fieldProps }/>);
}
