import React from 'react';
import LinkInfoListEditor from './components/LinkInfoListEditor';

export default function LinkInfoListEditorField(fieldProps) {
    return <LinkInfoListEditor error={!!fieldProps.state?.error} errorText={fieldProps.state?.error} {...fieldProps} />;
}
