import React from 'react';
import FileUploader from './containers/FileUploader';

export default function FileUploadField(fieldProps) {
    return(<FileUploader onChange={fieldProps.input.onChange} {...fieldProps} />);
}
