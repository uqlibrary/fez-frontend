import React from 'react';
import ScaleOfSignificanceForm from './ScaleOfSignificanceForm';
import ListEditor from './ListEditor';
import { ScaleOfSignificanceTemplate } from './ScaleOfSignificanceTemplate';

export default function ScaleOfSignificanceListEditor(fieldProps) {
    return (
        <ListEditor
            formComponent={ScaleOfSignificanceForm}
            rowItemTemplate={ScaleOfSignificanceTemplate}
            {...fieldProps}
        />
    );
}
