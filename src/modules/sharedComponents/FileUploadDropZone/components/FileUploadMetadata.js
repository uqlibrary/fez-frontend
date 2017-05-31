import React, {PureComponent} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {TextField, AutoCompleteSelect, DatePicker} from 'uqlibrary-react-toolbox';

// custom components
import FileUploadInfoRow from './FileUploadInfoRow';
import {locale} from 'config';
import {EMBARGO_ID} from './fileHelper';


export default class FileUploadMetadata extends PureComponent {

    static propTypes = {
        dataSource: PropTypes.array.isRequired,
        stepperIndex: PropTypes.number.isRequired,
        file: PropTypes.object.isRequired,
        form: PropTypes.string.isRequired,
        formValues: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            errorText: ''
        };
    }

    validateDescription = (event) => {
        if (event.target.value.match(/^$/)) {
            this.state.errorText = 'This is a required field';
        }
    }

    render() {
        const {stepperIndex, file, formValues} = this.props;
        const DateTimeFormat = global.Intl.DateTimeFormat;
        const fileInformation = locale.sharedComponents.files;

        const defaultDate = new Date();
        defaultDate.setHours(0, 0, 0, 0);

        return (
            <div>
                <div className="columns">
                    <div className="column">
                        <FileUploadInfoRow key={file.name} file={file} />
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <Field component={TextField}
                               name={`${fileInformation.fields.metadata.description}-${stepperIndex}`}
                               type="text" fullWidth multiLine
                               errorText={this.state.errorText}
                               onChange={this.validateDescription}
                               rows={3}
                               floatingLabelText={fileInformation.fields.descriptionLabel}
                               maxLength="255" />
                    </div>
                </div>
                <div className="columns">
                    <div className="column ">
                        <Field component={AutoCompleteSelect}
                               label={fileInformation.fields.accessConditionsLabel}
                               name={`${fileInformation.fields.metadata.accessCondition}-${stepperIndex}`}
                               dataSource={this.props.dataSource}
                               dataSourceConfig={{text: 'title', value: 'id'}}
                               formValue={formValues.get(`${fileInformation.fields.metadata.accessCondition}-${stepperIndex}`)}
                        />
                    </div>
                    <div className="column">
                        <Field component={DatePicker}
                               floatingLabelText={fileInformation.fields.embargoDateLabel}
                               fullWidth
                               name={`${fileInformation.fields.metadata.embargoDate}-${stepperIndex}`}
                               locale="en-AU"
                               DateTimeFormat={DateTimeFormat}
                               disabled={formValues.get(`${fileInformation.fields.metadata.accessCondition}-${stepperIndex}`) !== EMBARGO_ID}
                               minDate={defaultDate}
                        />
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        {fileInformation.dialog.disclaimer}
                    </div>
                </div>
            </div>
        );
    }
}
