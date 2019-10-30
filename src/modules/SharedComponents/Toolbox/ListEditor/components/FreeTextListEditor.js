import React from 'react';
import FreeTextForm from './FreeTextForm';
import ListEditor from './ListEditor';

export const FreeTextListEditor = fieldProps => {
    return <ListEditor formComponent={FreeTextForm} {...fieldProps} />;
};

export default FreeTextListEditor;
