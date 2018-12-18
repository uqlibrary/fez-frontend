import React from 'react';
import FreeTextListEditor from './components/FreeTextListEditor';

export default function ListEditorField(fieldProps) {
    console.log('==>', fieldProps);
    return(<FreeTextListEditor
        errorText={fieldProps.meta ? fieldProps.meta.error : null}
        error={fieldProps.meta && fieldProps.meta.error}
        onChange={fieldProps.input.onChange}
        remindToAdd={fieldProps.remindToAdd}
        maxInputLength={fieldProps.maxInputLength}
        {...fieldProps} />);
}
