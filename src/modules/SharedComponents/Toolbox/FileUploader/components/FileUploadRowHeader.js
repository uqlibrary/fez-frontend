import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    icon: {
        textAlign: 'center',
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    },
}));

export const FileUploadRowHeader = ({ onDeleteAll, locale, requireOpenAccessStatus, disabled, isAdmin }) => {
    const classes = useStyles();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const {
        filenameColumn,
        fileAccessColumn,
        fileSecurityPolicyColumn,
        embargoDateColumn,
        deleteAllFiles,
        deleteAllFilesConfirmation,
    } = locale;
    return (
        <Hidden only={['xs']}>
            <ConfirmationBox
                onAction={onDeleteAll}
                onClose={hideConfirmation}
                isOpen={isOpen}
                locale={deleteAllFilesConfirmation}
                confirmationBoxId="delete-all-files"
            />
            <div style={{ flexGrow: 1, padding: 4 }}>
                <Grid container direction="row" alignItems="center" spacing={1} className={classes.header} gutter={8}>
                    <Grid item md={6} sm={5}>
                        <Typography variant="caption" gutterBottom>
                            {filenameColumn}
                        </Typography>
                    </Grid>
                    <Grid item md={3} sm={4}>
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
                    <Grid item xs={1} className={classes.icon}>
                        <Tooltip title={deleteAllFiles}>
                            <span>
                                <IconButton onClick={showConfirmation} disabled={disabled} id="delete-all-files">
                                    <DeleteForeverIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>
            </div>
        </Hidden>
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
