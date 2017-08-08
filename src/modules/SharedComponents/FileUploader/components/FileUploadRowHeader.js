import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { ConfirmDialogBox } from 'uqlibrary-react-toolbox';

export default class FileUploadRowHeader extends Component {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        locale: PropTypes.object
    };

    static defaultProps = {
        locale: {
            filenameColumn: 'Filename',
            fileAccessColumn: 'Access conditions',
            embargoDateColumn: 'Embargo release date',
            deleteAllFiles: 'Remove all files from the upload queue',
            deleteAllFilesConfirmation: {
                confirmationTitle: 'Delete all',
                confirmationMessage: 'Are you sure you want to delete all records?',
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
        const {filenameColumn, fileAccessColumn, embargoDateColumn, deleteAllFiles, deleteAllFilesConfirmation} = this.props.locale;

        return (
            <div className="columns is-gapless is-mobile contributorsHeader datalist datalist-header">
                <ConfirmDialogBox onRef={ref => (this.confirmationBox = ref)}
                                  onAction={this.props.onDeleteAll}
                                  locale={deleteAllFilesConfirmation} />
                <div className="column is-6-desktop is-6-tablet is-12-mobile filename datalist-title" style={{textIndent: '12px'}}>
                    {filenameColumn}
                </div>
                <div className="column is-3-desktop is-3-tablet is-12-mobile file-access datalist-title">
                    {fileAccessColumn}
                </div>
                <div className="column is-2-desktop is-2-tablet is-12-mobile embargo-date datalist-title">
                    {embargoDateColumn}
                </div>
                <div className="column is-1-desktop is-1-tablet is-12-mobile delete-button datalist-title">
                    <IconButton tooltip={deleteAllFiles} tooltipPosition="bottom-left" onTouchTap={this._showConfirmation}>
                        <FontIcon className="material-icons deleteIcon">delete_forever</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}
