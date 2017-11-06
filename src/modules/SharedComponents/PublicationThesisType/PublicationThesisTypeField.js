import React from 'react';
import PublicationThesisTypeList from './components/PublicationThesisTypeList';

export default function PublicationThesisTypeField(fieldProps) {
    return (<PublicationThesisTypeList onChange={ fieldProps.input.onChange } { ...fieldProps } />);
}
