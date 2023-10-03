import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const FileUploadRowHeader = ({ onDeleteAll, locale, requireOpenAccessStatus, disabled, isAdmin }) => {
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const {
        filenameColumn,
        fileDescriptionColumn,
        fileAccessColumn,
        fileSecurityPolicyColumn,
        embargoDateColumn,
        deleteAllFiles,
        deleteAllFilesConfirmation,
    } = locale;
    return (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <ConfirmationBox
                onAction={onDeleteAll}
                onClose={hideConfirmation}
                isOpen={isOpen}
                locale={deleteAllFilesConfirmation}
                confirmationBoxId="delete-all-files"
            />
            <div style={{ flexGrow: 1, padding: 4 }}>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}
                    gutter={8}
                >
                    <Grid item md={3} sm={2}>
                        <Typography variant="caption" gutterBottom>
                            {filenameColumn}
                        </Typography>
                    </Grid>
                    <Grid item md={3} sm={3}>
                        <Typography variant="caption" gutterBottom>
                            {fileDescriptionColumn}
                        </Typography>
                    </Grid>
                    <Grid item md={3} sm={3}>
                        <Typography variant="caption" gutterBottom>
                            {isAdmin
                                ? requireOpenAccessStatus && fileSecurityPolicyColumn
                                : requireOpenAccessStatus && fileAccessColumn}
                        </Typography>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="caption" gutterBottom>
                            {requireOpenAccessStatus && embargoDateColumn}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: 'center' }}>
                        <Tooltip title={deleteAllFiles}>
                            <span>
                                <IconButton
                                    onClick={showConfirmation}
                                    disabled={disabled}
                                    id="delete-all-files"
                                    data-analyticsid="delete-all-files"
                                    data-testid="delete-all-files"
                                    size="large"
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>
            </div>
        </Box>
    );
};

FileUploadRowHeader.propTypes = {
    onDeleteAll: PropTypes.func.isRequired,
    locale: PropTypes.object,
    requireOpenAccessStatus: PropTypes.bool,
    disabled: PropTypes.bool,
    isAdmin: PropTypes.bool,
};

FileUploadRowHeader.defaultProps = {
    locale: {
        filenameColumn: 'File name',
        fileAccessColumn: 'Access conditions',
        fileDescriptionColumn: 'Description',
        fileSecurityPolicyColumn: 'Security policy',
        embargoDateColumn: 'Embargo release date',
        deleteAllFiles: 'Remove all files from the upload queue',
        deleteAllFilesConfirmation: {
            confirmationTitle: 'Delete all',
            confirmationMessage: 'Are you sure you want to delete all files?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
    },
};

export default React.memo(FileUploadRowHeader);
