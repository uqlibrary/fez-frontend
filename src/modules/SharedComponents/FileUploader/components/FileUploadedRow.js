import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

export default class FileUploadedRow extends Component {

    static propTypes = {
        index: PropTypes.number.isRequired,
        uploadedFile: PropTypes.object.isRequired,
        onDelete: PropTypes.func,
        showIdentifierLookup: PropTypes.bool,
        locale: PropTypes.object,
        uploadedFileSuffix: PropTypes.string
    };

    static defaultProps = {
        locale: {
            deleteHint: 'Remove this file',
            deleteRecordConfirmation: {
                confirmationTitle: 'Delete file',
                confirmationMessage: 'Are you sure you want to remove this file from the uploaded queue?',
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

    _deleteFile = () => {
        if (this.props.onDelete) this.props.onDelete(this.props.uploadedFile, this.props.index);
    };

    render() {
        const { deleteRecordConfirmation } = this.props.locale;
        return (
            <div className="columns is-gapless is-mobile uploadedFileRow datalist datalist-row">
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._deleteFile}
                    locale={deleteRecordConfirmation} />
                <div className="column datalist-text">
                    <span className="uploadedFile">{this.props.uploadedFile.nameAsPublished}</span>
                </div>
                <div className="column is-narrow uploadedFileDelete datalist-buttons">
                    <IconButton tooltip={this.props.locale.deleteHint} onTouchTap={this._showConfirmation}>
                        <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}

