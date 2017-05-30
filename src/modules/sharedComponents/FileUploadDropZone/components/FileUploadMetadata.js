import React, {PureComponent} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {TextField, AutoCompleteSelect, DatePicker} from 'uqlibrary-react-toolbox';

// custom components
import FileUploadInfoRow from './FileUploadInfoRow';
import {locale} from 'config';

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
    }

    render() {
        const {stepperIndex, file, formValues} = this.props;
        const DateTimeFormat = global.Intl.DateTimeFormat;
        const fileInformation = locale.sharedComponents.files;

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
                               name={`filesDescription-${stepperIndex}`}
                               type="text" fullWidth multiLine
                               rows={3}
                               floatingLabelText={fileInformation.fields.descriptionLabel}
                               maxLength="255" />
                    </div>
                </div>
                <div className="columns">
                    <div className="column access">
                        <Field component={AutoCompleteSelect}
                               label={fileInformation.fields.accessConditionsLabel}
                               name={`filesAccessConditions-${stepperIndex}`}
                               dataSource={this.props.dataSource}
                               dataSourceConfig={{text: 'title', value: 'id'}}
                               formValue={formValues.get(`filesAccessConditions-${stepperIndex}`)}
                        />
                    </div>
                    <div className="column">
                        <Field component={DatePicker}
                               floatingLabelText={fileInformation.fields.embargoDateLabel}
                               fullWidth
                               name={`fileEmbargoDate-${stepperIndex}`}
                               locale="en-AU"
                               DateTimeFormat={DateTimeFormat} />
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
