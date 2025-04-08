import React from 'react';
import LinkInfoListEditor from './components/LinkInfoListEditor';

export default function LinkInfoListEditorField(fieldProps) {
    return (
        <LinkInfoListEditor
            errorText={fieldProps.state ? fieldProps.state.error : null}
            error={fieldProps.state && fieldProps.state.error}
            {...fieldProps}
        />
    );
}
