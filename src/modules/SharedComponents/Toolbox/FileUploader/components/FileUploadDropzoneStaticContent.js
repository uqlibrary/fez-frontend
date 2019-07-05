import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';

const FileUploadDropzoneStaticContent = ({ locale, classes }) => (
    <Grid container className={classes.dropzone}>
        <Grid item xs={12} sm={6}>
            <Typography className={classes.heading}>
                {locale.fileUploadRestrictionHeading}
            </Typography>
            {locale.fileUploadRestrictions}
        </Grid>
        <Grid item xs={12} sm={6}>
            <Grid container direction="column" alignItems="center" justify="center" className={classes.instructions}>
                <Grid item>
                    <CloudUpload className={classes.cloudIcon}/>
                </Grid>
                <Grid item>
                    {locale.fileUploadInstruction}
                </Grid>
            </Grid>
        </Grid>
    </Grid>
);

FileUploadDropzoneStaticContent.propTypes = {
    locale: PropTypes.object,
    classes: PropTypes.object,
};

const styles = () => ({
    dropzone: {
        marginTop: 16,
        padding: '16px 32px 16px 32px',
        backgroundColor: '#f2f2f2',
        border: '2px dashed #8c8c8c',
        fontSize: '12px',
        lineHeight: '16px',
    },
    heading: {
        fontSize: 14,
        fontWeight: 400,
        marginTop: '14px',
        marginBottom: '14px',
    },
    instructions: {
        height: '100%',
    },
    cloudIcon: {
        fontSize: 36,
        color: 'rgb(89, 89, 89)',
    },
});

export default withStyles(styles)(FileUploadDropzoneStaticContent);
