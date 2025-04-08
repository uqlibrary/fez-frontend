import React from 'react';
import ScaleOfSignificanceListEditor from './ScaleOfSignificanceListEditor';

export default function ScaleOfSignificanceListEditorField(fieldProps) {
    return (
        <ScaleOfSignificanceListEditor
            listEditorId="rek-significance"
            errorText={fieldProps.meta ? fieldProps.meta.error : /* istanbul ignore next */ null}
            error={fieldProps.meta && fieldProps.meta.error}
            input={fieldProps}
            {...fieldProps}
        />
    );
}
