import React from 'react';
import PublicationSubTypeContainer from '../containers/PublicationSubtype';

export default function PublicationSubtype(fieldProps) {
    return (<PublicationSubTypeContainer onChange={ fieldProps.input.onChange } { ...fieldProps }/>);
}
