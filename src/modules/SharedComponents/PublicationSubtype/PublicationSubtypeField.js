import React from 'react';
import PublicationSubtypeForm from './components/PublicationSubtypeForm';

export default function PublicationSubtypeField(fieldProps) {
    return (<PublicationSubtypeForm onChange={ fieldProps.input.onChange } { ...fieldProps } />);
}
