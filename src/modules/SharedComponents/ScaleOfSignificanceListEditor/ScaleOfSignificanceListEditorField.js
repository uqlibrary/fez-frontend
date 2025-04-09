import React from 'react';
import ScaleOfSignificanceListEditor from './ScaleOfSignificanceListEditor';

export default function ScaleOfSignificanceListEditorField(fieldProps) {
    return (
        <ScaleOfSignificanceListEditor
            listEditorId="rek-significance"
            errorText={fieldProps.state ? fieldProps.state.error : /* istanbul ignore next */ null}
            error={fieldProps.state && fieldProps.state.error}
            {...fieldProps}
        />
    );
}
