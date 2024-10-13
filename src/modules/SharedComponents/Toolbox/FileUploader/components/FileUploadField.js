import React from 'react';
import FileUploader from './FileUploader';

export default function FileUploadField(fieldProps) {
    return <FileUploader onChange={fieldProps.input?.onChange} {...fieldProps} />;
}
