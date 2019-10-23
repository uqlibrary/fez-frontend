import React from 'react';
import ScaleOfSignificanceListEditor from './components/ScaleOfSignificanceListEditor';

export default function ScaleOfSignificanceListEditorField(fieldProps) {
    return (
        <ScaleOfSignificanceListEditor
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            error={fieldProps.meta && fieldProps.meta.error}
            onChange={fieldProps.input.onChange}
            {...fieldProps}
        />
    );
}
