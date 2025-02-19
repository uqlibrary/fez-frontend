/* eslint-disable react/prop-types */
import React from 'react';
import ContributorsEditor from './components/ContributorsEditor';

export default function ContributorsEditorField(fieldProps) {
    return (
        <ContributorsEditor
            onChange={fieldProps?.onChange || fieldProps.input?.onChange}
            {...fieldProps}
            value={fieldProps.value || fieldProps.input.value || []}
        />
    );
}
