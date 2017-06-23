import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

// custom components
import {locale} from 'config';
import './FileMetadata.scss';

const fileUploadProgress = [];

export default class FileMetadata extends Component {

    static propTypes = {
        acceptedFiles: PropTypes.object.isRequired,
        deleteAllFiles: PropTypes.func,
        deleteFile: PropTypes.func,
        form: PropTypes.string.isRequired,
        setCheckboxState: PropTypes.func,
        uploadError: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpenAccess: false,
            accessFields: [],
            completed: 0,
            deleteSingleFile: true,
            deleteFileIndex: -1,
            deleteDialogContent: '',
            deleteDialogOpen: false
        };
    }

    componentWillUpdate(nextProps) {
        const {uploadProgress} = nextProps;
        fileUploadProgress[uploadProgress.get('name')] = uploadProgress.get('progress');
    }

    buildDatePicker = (id) => {
        const DateTimeFormat = global.Intl.DateTimeFormat;
        const currentDate = new Date();
        const currentDateStr = `${currentDate.getUTCDate()}/${currentDate.getUTCMonth() + 1}/${currentDate.getUTCFullYear()}`;
        const fileInformation = locale.sharedComponents.files;
        const datepickerFieldName = `${fileInformation.fields.datepickerAccess}${id}`;
        const selectFieldName = `${fileInformation.fields.fileAccess}${id}`;
        const accessIds = fileInformation.constants;
        const disabled = this.state.accessFields[selectFieldName] !== accessIds.embargoAccessId;

        return (
        <DatePicker
            className="datepicker"
            disabled={disabled}
            DateTimeFormat={DateTimeFormat}
            firstDayOfWeek={0}
            hintText={currentDateStr}
            locale="en-AU"
            name={datepickerFieldName}
            style={{width: 90}}
        />);
    };

    buildSelectField = (id) => {
        const fileInformation = locale.sharedComponents.files;
        const fieldName = `${fileInformation.fields.fileAccess}${id}`;
        const accessIds = fileInformation.constants;
        const selectFieldValues = fileInformation.fields.selectField;

        return(
            <SelectField
                className="selectField"
                key={fieldName}
                name={fieldName}
                onChange={this.updateLocalState(fieldName)}
                style={{width: 180}}
                value={this.state.accessFields[fieldName] || accessIds.openAccessId}
            >
                <MenuItem value={accessIds.openAccessId} primaryText={selectFieldValues.openAccessValue} />
                <MenuItem value={accessIds.closedAccessId} primaryText={selectFieldValues.closedAccessValue} />
                <MenuItem value={accessIds.embargoAccessId} primaryText={selectFieldValues.embargoedAccessValue} />
            </SelectField>
        );
    };

    buildInterface = () => {
        const {acceptedFiles, uploadError} = this.props;
        const fileInformation = locale.sharedComponents.files;
        const messages = fileInformation.messages;

        return(
            acceptedFiles.map((file, index) => {
                const fieldName = `${file}${index}`;

                return (
                    <Toolbar className="metadata-row" key={fieldName}>
                        <ToolbarGroup className="filename">
                            <FontIcon className="material-icons mobile-icon">attachment</FontIcon>
                            <span className="filename-label">{file.name}</span>
                        </ToolbarGroup>
                        <ToolbarGroup className="file-access">
                            <FontIcon className="material-icons mobile-icon">lock_outline</FontIcon>
                            <span className="label">File Access</span>
                            {this.buildSelectField(index)}
                        </ToolbarGroup>
                        <ToolbarGroup className="embargo-date">
                            <FontIcon className="material-icons mobile-icon">date_range</FontIcon>
                            <span className="label">Embargo Date</span>
                            {this.buildDatePicker(index)}
                            {fileUploadProgress[file.name] && (
                                ((fileUploadProgress[file.name] < locale.sharedComponents.files.constants.completed) ||
                                fileUploadProgress[file.name] === locale.sharedComponents.files.constants.completed && uploadError.length > 0) &&
                                <CircularProgress
                                    className="upload-progress"
                                    mode="determinate"
                                    value={fileUploadProgress[file.name]}
                                    size={30}
                                    thickness={4}
                                />
                            )}

                            {fileUploadProgress[file.name] && (
                                (fileUploadProgress[file.name] === locale.sharedComponents.files.constants.completed) && uploadError.length === 0 &&
                                <FontIcon
                                className="material-icons green-tick">done</FontIcon>
                            )}
                            <IconButton
                                tooltip={messages.deleteFileToolTip}
                                tooltipPosition="bottom-left"
                                onClick={() => this.deleteFileConfirmation(index)}>
                                <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                );
            })
        );
    };

    deleteFileAction = () => {
        if (this.state.deleteSingleFile) {
            this.props.deleteFile(this.state.deleteFileIndex);
        } else {
            this.props.deleteAllFiles();
        }

        this.handleClose();
    };

    deleteAllFilesConfirmation = () => {
        const fileInformation = locale.sharedComponents.files;
        const messages = fileInformation.messages;

        this.setState({
            deleteSingleFile: false,
            deleteFileIndex: -1,
            deleteDialogOpen: true,
            deleteDialogContent: messages.deleteAllFilesDialogContent
        });
    };

    deleteFileConfirmation = (index) => {
        const fileInformation = locale.sharedComponents.files;
        const messages = fileInformation.messages;

        this.setState({
            deleteSingleFile: true,
            deleteFileIndex: index,
            deleteDialogOpen: true,
            deleteDialogContent: messages.deleteFileDialogContent
        });
    };

    handleClose = () => {
        this.setState({
            deleteAction: '',
            deleteFileIndex: -1,
            deleteDialogOpen: false,
            deleteDialogContent: ''
        });
    };

    isOpenAccessSelected = () => {
        let found = false;

        Object.keys(this.state.accessFields).map(field => {
            if (this.state.accessFields[field] === locale.sharedComponents.files.constants.openAccessId) {
                found = true;
            }
        });

        return found;
    };

    updateLocalState = (fieldName) => (event, index, value) => {
        const data = this.state.accessFields;
        data[fieldName] = value;

        this.setState({accessFields: data});
        this.setState({isOpenAccess: this.isOpenAccessSelected()});
    };

    render() {
        const {acceptedFiles, setCheckboxState} = this.props;
        const fileInformation = locale.sharedComponents.files;
        const buttonLabels = locale.global.labels.buttons;
        const messages = fileInformation.messages;

        // check if open access OR
        // check if the number of manipulated selectFields is less than the total number of accepted files (because we default all selectFields to open access)
        const showOpenAccessNotice = this.state.isOpenAccess || Object.keys(this.state.accessFields).length < acceptedFiles.size;

        const deleteActions = [
            <FlatButton
                label={buttonLabels.cancel}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={buttonLabels.delete}
                secondary
                style={{marginLeft: '12px'}}
                onTouchTap={this.deleteFileAction}
            />,
        ];

        return (
            <div className="metadata-container">
                <Dialog
                    actions={deleteActions}
                    modal={false}
                    open={this.state.deleteDialogOpen}
                    onRequestClose={this.handleClose}
                >
                    {this.state.deleteDialogContent}
                </Dialog>
                <Toolbar className="header metadata-row">
                    <ToolbarGroup className="filename">
                        {fileInformation.list.filenameLabel}
                    </ToolbarGroup>
                    <ToolbarGroup className="file-access header">
                        {fileInformation.list.fileAccessLabel}
                    </ToolbarGroup>
                    <ToolbarGroup className="embargo-date header">
                        {fileInformation.list.embargoDateLabel}
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconButton
                            tooltip={messages.deleteAllFilesToolTip}
                            tooltipPosition="bottom-left"
                            onClick={this.deleteAllFilesConfirmation}>
                            <FontIcon className="material-icons deleteIcon">delete_sweep</FontIcon>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                {this.buildInterface()}

                {showOpenAccessNotice && (
                    <Checkbox
                        className="open-access-checkbox"
                        label={messages.openAccessConfirmation}
                        onCheck={setCheckboxState}
                    />
                )}
            </div>
        );
    }
}
