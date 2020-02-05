import React from 'react';
import ListEditor from './ListEditor';
import { IssnUlrichLinkTemplate } from './IssnUlrichLinkTemplate';
import { IssnForm } from './IssnForm';

export const IssnListEditor = fieldProps => {
    return <ListEditor formComponent={IssnForm} rowItemTemplate={IssnUlrichLinkTemplate} {...fieldProps} />;
};

export default IssnListEditor;
