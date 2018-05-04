import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

const FileUploadDropzoneStaticContent = ({locale}) => (
    <div className="columns file-instructions">
        <div className="column">
            {locale.fileUploadRestrictionHeading}
            {locale.fileUploadRestrictions}
        </div>
        <div className="column upload-instructions">
            <FontIcon className="material-icons">cloud_upload</FontIcon>
            {locale.fileUploadInstruction}
        </div>
    </div>
);

FileUploadDropzoneStaticContent.propTypes = {
    locale: PropTypes.object
};

export default FileUploadDropzoneStaticContent;
