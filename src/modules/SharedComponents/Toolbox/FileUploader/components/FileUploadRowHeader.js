import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from '../../ConfirmDialogBox';

export default class FileUploadRowHeader extends PureComponent {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        locale: PropTypes.object,
        requireOpenAccessStatus: PropTypes.bool,
        disabled: PropTypes.bool
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

        return (
            <div className="columns is-gapless is-mobile uploadedFileHeader datalist datalist-header headers is-hidden-mobile">
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.props.onDeleteAll}
                    locale={deleteAllFilesConfirmation}/>
                <div className="column datalist-title is-6-desktop is-5-tablet is-12-mobile header">
                    {filenameColumn}
                </div>
                <div className="column datalist-title is-3-desktop is-4-tablet is-12-mobile header">
                    {
                        this.props.requireOpenAccessStatus && fileAccessColumn
                    }
                </div>
                <div className="column datalist-title is-2-desktop is-2-tablet is-12-mobile header">
                    {
                        this.props.requireOpenAccessStatus && embargoDateColumn
                    }
                </div>
                <div className="column is-narrow buttons datalist-buttons is-1-desktop is-1-tablet is-12-mobile header is-centered is-vcentered">
                    <IconButton tooltip={deleteAllFiles} onTouchTap={this._showConfirmation} disabled={this.props.disabled}>
                        <FontIcon className="material-icons">delete_forever</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}
