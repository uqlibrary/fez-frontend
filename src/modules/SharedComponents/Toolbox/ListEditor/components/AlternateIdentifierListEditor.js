import React from 'react';
import AlternateIdentifierForm from './AlternateIdentifierForm';
import ListEditor from './ListEditor';
import { AlternateIdentifierTemplate } from './AlternateIdentifierTemplate';

export const AlternateIdentifierListEditor = fieldProps => {
    return (
        <ListEditor
            formComponent={AlternateIdentifierForm}
            rowItemTemplate={AlternateIdentifierTemplate}
            {...fieldProps}
        />
    );
};

export default AlternateIdentifierListEditor;
