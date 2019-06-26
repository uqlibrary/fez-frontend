import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { validation } from 'config';

/* istanbul ignore next */
export const FilesSection = ({ disabled = false }) => (
    <React.Fragment>
        <Grid container spacing={16}>
            <Grid item xs={12} sm={12}>
                <Typography variant="body2" component="p">Some explanatory text might go here. It may not. Time will tell.</Typography>
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <Field
                name="filesSection.files"
                disabled={disabled}
                component={FileUploadField}
                requireOpenAccessStatus
                validate={[validation.validFileUpload]}
            />
        </Grid>
    </React.Fragment>
);

FilesSection.propTypes = {
    disabled: PropTypes.bool
};

export default React.memo(FilesSection);
