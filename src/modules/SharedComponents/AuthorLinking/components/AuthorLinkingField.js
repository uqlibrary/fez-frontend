import React from 'react';
import AuthorLinking from './AuthorLinking';

export default function AuthorLinkingField(fieldProps) {
    return(<AuthorLinking onChange={fieldProps.input.onChange} {...fieldProps} />);
}
