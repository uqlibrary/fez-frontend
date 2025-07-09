import React from 'react';
import ScaleOfSignificanceListEditor from './ScaleOfSignificanceListEditor';

export default function ScaleOfSignificanceListEditorField(fieldProps) {
    return (
        <ScaleOfSignificanceListEditor
            listEditorId="rek-significance"
            error={!!fieldProps.state?.error}
            errorText={fieldProps.state?.error}
            {...fieldProps}
        />
    );
}
