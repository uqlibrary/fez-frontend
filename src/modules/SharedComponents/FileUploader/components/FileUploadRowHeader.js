import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

export default class FileUploadRowHeader extends Component {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        locale: PropTypes.object,
        requireFileAccess: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            filenameColumn: 'Filename',
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

    constructor(props) {
        super(props);
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    render() {
        const { filenameColumn, fileAccessColumn, embargoDateColumn, deleteAllFiles, deleteAllFilesConfirmation } = this.props.locale;

        return (
            <div className="columns is-gapless is-mobile uploadedFileHeader datalist datalist-header">
                <ConfirmDialogBox onRef={ ref => (this.confirmationBox = ref) }
                                  onAction={ this.props.onDeleteAll }
                                  locale={ deleteAllFilesConfirmation } />
                <div className="column filename datalist-title" style={{ textIndent: '12px' }}>
                    { filenameColumn }
                </div>
                {
                    this.props.requireFileAccess &&
                    <div className="column file-access datalist-title">
                        { fileAccessColumn }
                    </div>
                }
                {
                    this.props.requireFileAccess &&
                    <div className="column embargo-date datalist-title">
                        { embargoDateColumn }
                    </div>
                }
                <div className="column is-narrow buttons datalist-buttons">
                    <IconButton tooltip={ deleteAllFiles } onTouchTap={ this._showConfirmation }>
                        <FontIcon className="material-icons">delete_forever</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}
