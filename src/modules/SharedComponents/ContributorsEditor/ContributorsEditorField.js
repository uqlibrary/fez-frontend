import React from 'react';
import ContributorsEditor from './components/ContributorsEditor';

export default function ContributorsEditorField(fieldProps) {
    console.log(fieldProps);
    return <ContributorsEditor {...fieldProps} />;
}
