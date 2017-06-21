import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';

// custom components
import {locale} from 'config';
import './FileMetadata.scss';

const fileUploadProgress = [];

export default class FileMetadata extends Component {

    static propTypes = {
        acceptedFiles: PropTypes.object.isRequired,
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
        };
    }

    componentWillUpdate(nextProps) {
        fileUploadProgress[nextProps.uploadProgress.get('name')] = nextProps.uploadProgress.get('progress');
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

        return(
            acceptedFiles.map((file, index) => {
                const fieldName = `${file}${index}`;

                return (
                    <Toolbar className="metadataRow" key={fieldName}>
                        <ToolbarGroup className="filename">
                            <div>{file.name}</div>
                        </ToolbarGroup>
                        <ToolbarGroup className="fileAccess">
                            {this.buildSelectField(index)}
                        </ToolbarGroup>
                        <ToolbarGroup className="embargoDate">
                            {this.buildDatePicker(index)}
                            {fileUploadProgress[file.name] && (
                                ((fileUploadProgress[file.name] < locale.sharedComponents.files.constants.completed) ||
                                fileUploadProgress[file.name] === locale.sharedComponents.files.constants.completed && uploadError.length > 0) &&
                                <CircularProgress
                                    className="uploadProgress"
                                    mode="determinate"
                                    value={fileUploadProgress[file.name]}
                                    size={30}
                                    thickness={4}
                                />
                            )}

                            {fileUploadProgress[file.name] && (
                                (fileUploadProgress[file.name] === locale.sharedComponents.files.constants.completed) && uploadError.length === 0 &&
                                <FontIcon
                                className="material-icons greenTick">done</FontIcon>
                            )}
                            <FontIcon
                                onClick={() => this.deleteRow(index)}
                                className="material-icons">delete</FontIcon>
                        </ToolbarGroup>
                    </Toolbar>
                );
            })
        );
    };

    deleteRow = (index) => {
        this.props.deleteFile(index);
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
        const messages = fileInformation.messages;

        const showOpenAccessNotice = this.state.isOpenAccess || Object.keys(this.state.accessFields).length < acceptedFiles.size;

        return (
            <div className="metadataContainer">
                <Toolbar className="header metadataRow">
                    <ToolbarGroup className="filename">
                        {fileInformation.list.filenameLabel}
                    </ToolbarGroup>
                    <ToolbarGroup className="fileAccess header">
                        {fileInformation.list.fileAccessLabel}
                    </ToolbarGroup>
                    <ToolbarGroup className="embargoDate header">
                        {fileInformation.list.embargoDateLabel}
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <FontIcon
                            className="material-icons">delete</FontIcon>
                    </ToolbarGroup>
                </Toolbar>
                {this.buildInterface()}

                {showOpenAccessNotice && (
                    <Checkbox
                        className="openAccessCheckbox"
                        label={messages.openAccessConfirmation}
                        onCheck={setCheckboxState}
                    />
                )}
            </div>
        );
    }
}
