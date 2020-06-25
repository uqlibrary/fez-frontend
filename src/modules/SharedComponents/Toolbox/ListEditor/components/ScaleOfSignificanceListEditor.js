import React from 'react';
import ScaleOfSignificanceForm from './ScaleOfSignificanceForm';
import ListEditor from './ListEditor';
import { ScaleOfSignificanceTemplate } from './ScaleOfSignificanceTemplate';

export const ScaleOfSignificanceListEditor = fieldProps => {
    return (
        <ListEditor
            listEditorId="rek-significance"
            formComponent={ScaleOfSignificanceForm}
            rowItemTemplate={ScaleOfSignificanceTemplate}
            {...fieldProps}
        />
    );
};

export default ScaleOfSignificanceListEditor;
