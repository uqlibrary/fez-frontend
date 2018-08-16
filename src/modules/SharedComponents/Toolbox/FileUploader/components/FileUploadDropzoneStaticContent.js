import React from 'react';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core';
import {CloudUpload} from '@material-ui/icons';

const FileUploadDropzoneStaticContent = ({locale}) => (
    <Grid container className="file-instructions">
        <Grid item xs={12} sm={6}>
            {locale.fileUploadRestrictionHeading}
            {locale.fileUploadRestrictions}
        </Grid>
        <Grid item xs={12} sm={6} className="upload-instructions">
            <Grid container direction="column" alignItems="center">
                <Grid item>
                    <CloudUpload/>
                </Grid>
                <Grid item>
                    {locale.fileUploadInstruction}
                </Grid>
            </Grid>
        </Grid>
    </Grid>
);

FileUploadDropzoneStaticContent.propTypes = {
    locale: PropTypes.object
};

export default FileUploadDropzoneStaticContent;
