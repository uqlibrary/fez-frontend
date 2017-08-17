import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';
import FileUploadAccessSelector from './FileUploadAccessSelector';
import {OPEN_ACCESS_ID} from './FileUploadAccessSelector';

class FileUploadRow extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        uploadedFile: PropTypes.object.isRequired,
        onDelete: PropTypes.func.isRequired,
        onAttributeChanged: PropTypes.func.isRequired,
        locale: PropTypes.object,
        progress: PropTypes.number,
        requireFileAccess: PropTypes.bool.isRequired
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
        this.state = {
            access_condition_id: null,
            date: null
        };
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    _deleteFile = () => {
        if (this.props.onDelete) this.props.onDelete(this.props.uploadedFile, this.props.index);
    };

    _updateFileMetadata = (update) => {
        this.setState({ [update.key]: update.value });
        this.props.uploadedFile[update.key] = update.value;
        if (this.props.onAttributeChanged) this.props.onAttributeChanged(this.props.uploadedFile, this.props.index);
    };

    _isOpenAccess = (accessConditionId) => {
        return accessConditionId === OPEN_ACCESS_ID;
    };

    render() {
        const { deleteRecordConfirmation } = this.props.locale;
        const { access_condition_id } = this.state;
        return (
            <div className="columns is-gapless is-mobile uploadedFileRow datalist datalist-row">
                <ConfirmDialogBox
                    onRef={ ref => (this.confirmationBox = ref) }
                    onAction={ this._deleteFile }
                    locale={ deleteRecordConfirmation } />
                <div className="column datalist-text filename">
                    <span className="filename-label">{ this.props.uploadedFile.name }</span>
                </div>
                {
                    this.props.requireFileAccess &&
                    <div className="column datalist-text file-access">
                        <FileUploadAccessSelector onAccessChanged={ this._updateFileMetadata }/>
                    </div>
                }
                {
                    this.props.requireFileAccess && !this._isOpenAccess(access_condition_id) &&
                    <div className="column datalist-text embargo-date">
                        <span>No Date</span>
                    </div>
                }
                {
                    this.props.requireFileAccess && this._isOpenAccess(access_condition_id) &&
                    <div className="column datalist-text embargo-date">
                        <span>Embargo Date</span>
                    </div>
                }
                {
                    this.props.progress === 0 &&
                        <div className="column is-narrow uploadedFileDelete datalist-buttons">
                            <IconButton tooltip={ this.props.locale.deleteHint } onTouchTap={ this._showConfirmation }>
                                <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                            </IconButton>
                        </div>
                }
                {
                    this.props.progress > 0 &&
                        <div className="upload-progress-wrapper">
                            <CircularProgress
                                className="upload-progress"
                                mode="determinate"
                                value={ this.props.progress }
                                size={ 20 }
                                thickness={ 4 }
                            />
                        </div>
                }
                {
                    this.props.progress === 100 &&
                        <FontIcon className="material-icons green-tick">done</FontIcon>
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        progress: state.get('fileUpload')[ownProps.uploadedFile.name] || 0
    };
};

export default connect(mapStateToProps)(FileUploadRow);
