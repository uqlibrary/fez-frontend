import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CloudUpload from '@mui/icons-material/CloudUpload';
import withStyles from '@mui/styles/withStyles';

const FileUploadDropzoneStaticContent = ({ locale, classes }) => (
    <Grid container className={classes.dropzone}>
        <Grid item xs={12} sm={6}>
            <Typography className={classes.heading}>{locale.fileUploadRestrictionHeading}</Typography>
            {locale.fileUploadRestrictions}
        </Grid>
        <Grid item xs={12} sm={6}>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                className={classes.instructions}
            >
                <Grid item>
                    <CloudUpload className={classes.cloudIcon} />
                </Grid>
                <Grid item>{locale.fileUploadInstruction}</Grid>
            </Grid>
        </Grid>
    </Grid>
);

FileUploadDropzoneStaticContent.propTypes = {
    locale: PropTypes.object,
    classes: PropTypes.object,
};

const styles = theme => ({
    dropzone: {
        marginTop: 16,
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
        },
        backgroundColor: '#f2f2f2',
        border: '2px dashed #8c8c8c',
        fontSize: '12px',
        lineHeight: '16px',

        '& ul': {
            [theme.breakpoints.down('sm')]: {
                paddingInlineStart: theme.spacing(2),
            },
        },
    },
    heading: {
        fontSize: 14,
        fontWeight: 400,
        marginTop: '14px',
        marginBottom: '14px',
    },
    instructions: {
        height: '100%',
        textAlign: 'center',
    },
    cloudIcon: {
        fontSize: 36,
        color: 'rgb(89, 89, 89)',
    },
});

export default withStyles(styles, { withTheme: true })(FileUploadDropzoneStaticContent);
