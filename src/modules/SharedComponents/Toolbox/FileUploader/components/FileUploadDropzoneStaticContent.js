import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CloudUpload from '@mui/icons-material/CloudUpload';

const StyledGridDropzone = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
    },
    backgroundColor: '#f2f2f2',
    border: '2px dashed #8c8c8c',
    fontSize: 12,
    lineHeight: '16px',

    '& ul': {
        [theme.breakpoints.down('sm')]: {
            paddingInlineStart: theme.spacing(2),
        },
    },
}));
const FileUploadDropzoneStaticContent = ({ locale }) => (
    <StyledGridDropzone container className={'FileUploadTermsAndConditions-root'}>
        <Grid item xs={12} sm={6}>
            <Typography fontSize={14} fontWeight={400} mt={'14px'} mb={'14px'}>
                {locale.fileUploadRestrictionHeading}
            </Typography>
            {locale.fileUploadRestrictions}
        </Grid>
        <Grid item xs={12} sm={6}>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ height: '100%', textAlign: 'center' }}
            >
                <Grid item>
                    <CloudUpload sx={{ fontSize: 36, color: 'rgb(89, 89, 89)' }} />
                </Grid>
                <Grid item>{locale.fileUploadInstruction}</Grid>
            </Grid>
        </Grid>
    </StyledGridDropzone>
);

FileUploadDropzoneStaticContent.propTypes = {
    locale: PropTypes.object,
};

export default FileUploadDropzoneStaticContent;
