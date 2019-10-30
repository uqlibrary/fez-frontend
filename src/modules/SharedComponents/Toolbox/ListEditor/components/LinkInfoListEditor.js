import React from 'react';
import LinkInfoForm from './LinkInfoForm';
import ListEditor from './ListEditor';
import { LinkInfoTemplate } from './LinkInfoTemplate';

export const LinkInfoListEditor = fieldProps => {
    return <ListEditor formComponent={LinkInfoForm} rowItemTemplate={LinkInfoTemplate} {...fieldProps} />;
};

export default LinkInfoListEditor;
