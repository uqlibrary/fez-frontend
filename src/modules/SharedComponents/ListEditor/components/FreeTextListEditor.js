import React from 'react';
import FreeTextForm from './FreeTextForm';
import ListEditor from './ListEditor';

export default function FreeTextListEditor(fieldProps) {
    return(<ListEditor formComponent={FreeTextForm} {...fieldProps} />);
}
