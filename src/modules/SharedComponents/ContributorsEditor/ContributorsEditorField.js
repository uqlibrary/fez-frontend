import React from 'react';
import ContributorsEditor from './components/ContributorsEditor';

export default function ContributorsEditorField(fieldProps) {
    return <ContributorsEditor onChange={fieldProps.input?.onChange} {...fieldProps} />;
}
