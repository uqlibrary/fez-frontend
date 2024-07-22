import React from 'react';
import FileUploader from './FileUploader';

export const FileUploadField = fieldProps => {
    return <FileUploader {...fieldProps} />;
};
const isSame = (prev, next) => prev.disabled === next.disable;
export default React.memo(FileUploadField, isSame);
