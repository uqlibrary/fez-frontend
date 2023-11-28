import React from 'react';
import ScaleOfSignificanceListEditor from './ScaleOfSignificanceListEditor';
import { useSelector } from 'react-redux';

export default function ScaleOfSignificanceListEditorField(fieldProps) {
    console.log('Field Props', fieldProps);
    const contributors = useSelector(state => state.get('adminAuthorsReducer'));
    console.log('USE SELECTOR CONTRIBS', contributors);
    return (
        <ScaleOfSignificanceListEditor
            listEditorId="rek-significance"
            errorText={fieldProps.meta ? fieldProps.meta.error : /* istanbul ignore next */ null}
            error={fieldProps.meta && fieldProps.meta.error}
            onChange={fieldProps.input.onChange}
            {...fieldProps}
        />
    );
}
