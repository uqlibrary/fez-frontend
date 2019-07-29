import React from 'react';
import LinkInfoForm from './LinkInfoForm';
import ListEditor from './ListEditor';
import { LinkInfoTemplate } from './LinkInfoTemplate';

export default function LinkInfoListEditor(fieldProps) {
    return <ListEditor formComponent={LinkInfoForm} rowItemTemplate={LinkInfoTemplate} {...fieldProps} />;
}
