import React from 'react';
import PublicationSubtypesList from './components/PublicationSubtypesList';

export default function PublicationSubtypeField(fieldProps) {
    return (<PublicationSubtypesList onChange={ fieldProps.input.onChange } { ...fieldProps } />);
}
