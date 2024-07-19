import React from 'react';
import FileUploader from './FileUploader';

export const FileUploadField = fieldProps => {
    console.log(fieldProps);
    return <FileUploader {...fieldProps} />;
};
const isSame = (prev, next) => prev.disabled === next.disable;
export default React.memo(FileUploadField, isSame);

// here, trying to get files to work, this component would endless
// rerender without the isSame check. It breaks if that isSame
// func includes extra checks that are relevant like
// prev.value?.queue === next.value?.queue && prev.value?.isValid === next.value?.isValid;
// so somethign mad is going on elsewhere.
// anyway write up findings and give plenty time towards
// doing this properly, cos there's still things to figure out like
// live validation, submit validation, error reporting,
// combineReducers etc.
