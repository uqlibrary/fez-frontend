import React from 'react';
import FontIcon from 'material-ui/FontIcon';

const FileUploadDropzoneStaticContent = () => (
    <div className="columns file-instructions">
        <div className="column">
            <h3>File upload restrictions</h3>
            <div>
                Please ensure your files:
                <ul>
                    <li>begin with a letter and are less than 45 characters long</li>
                    <li>contain only upper and lowercase alphanumeric characters, and underscores</li>
                    <li>have only a single period which precedes the file extension: “.pdf”</li>
                    <li>are uploaded individually and not inside a folder</li>
                </ul>
            </div>
        </div>
        <div className="column upload-instructions">
            <FontIcon
                className="material-icons">cloud_upload</FontIcon>
            <p>Click here to select files, or drag files into this area to upload</p>
        </div>
    </div>
);

export default FileUploadDropzoneStaticContent;
