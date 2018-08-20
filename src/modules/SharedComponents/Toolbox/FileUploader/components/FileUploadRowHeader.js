import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ConfirmDialogBox} from '../../ConfirmDialogBox';

import {Grid, Typography, withWidth, Hidden, IconButton, Tooltip} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {withStyles} from '@material-ui/core/styles';

export class FileUploadRowHeader extends PureComponent {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        locale: PropTypes.object,
        requireOpenAccessStatus: PropTypes.bool,
        disabled: PropTypes.bool,
        classes: PropTypes.object
    };

    static defaultProps = {
        locale: {
            filenameColumn: 'File name',
            fileAccessColumn: 'Access conditions',
            embargoDateColumn: 'Embargo release date',
            deleteAllFiles: 'Remove all files from the upload queue',
            deleteAllFilesConfirmation: {
                confirmationTitle: 'Delete all',
                confirmationMessage: 'Are you sure you want to delete all files?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            }
        }
    };

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    render() {
        const {filenameColumn, fileAccessColumn, embargoDateColumn, deleteAllFiles, deleteAllFilesConfirmation} = this.props.locale;
        const {classes, requireOpenAccessStatus, disabled} = this.props;
        return (
            <Hidden only={['xs']}>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.props.onDeleteAll}
                    locale={deleteAllFilesConfirmation}
                />
                <Grid container direction="row" alignItems="center" spacing={8} className={classes.header}>
                    <Grid item md={6} sm={5}>
                        <Typography variant="caption" gutterBottom>{filenameColumn}</Typography>
                    </Grid>
                    <Grid item md={3} sm={4}>
                        <Typography variant="caption" gutterBottom>{requireOpenAccessStatus && fileAccessColumn}</Typography>
                    </Grid>
                    <Grid item md={2} sm={2}>
                        <Typography variant="caption" gutterBottom>{requireOpenAccessStatus && embargoDateColumn}</Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.icon}>
                        <Tooltip title={deleteAllFiles}>
                            <IconButton onClick={this._showConfirmation} disabled={disabled}>
                                <DeleteForeverIcon/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Hidden>
        );
    }
}
const styles = () => ({
    icon: {
        textAlign: 'center'
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
    }
});

export default withWidth()(withStyles(styles)(FileUploadRowHeader));
