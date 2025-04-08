import React from 'react';
import LinkInfoListEditor from './components/LinkInfoListEditor';

export default function LinkInfoListEditorField(fieldProps) {
    return (
        <LinkInfoListEditor
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            error={fieldProps.meta && fieldProps.meta.error}
            {...fieldProps}
        />
    );
}
