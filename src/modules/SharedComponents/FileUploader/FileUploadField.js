import React from 'react';
import { default as FileUploader } from './components/FileUploader';

export default function FileUploadField(fieldProps) {
    return(<FileUploader onChange={fieldProps.input.onChange} {...fieldProps} />);
}
