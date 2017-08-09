import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

const FileUploadErrorMessage = ({ error }) => (
    <div className="fileUploadErrorMessage columns is-gapless is-mobile">
        <div className="column is-narrow Icon">
            <FontIcon className="material-icons">error</FontIcon>
        </div>
        <div className="column Message">
            { error.join('; ') }
        </div>
    </div>
);

FileUploadErrorMessage.propTypes = {
    error: PropTypes.string
};

export default FileUploadErrorMessage;
