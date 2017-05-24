import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';

import {TextField} from 'uqlibrary-react-toolbox';
import DatePicker from 'material-ui/DatePicker';
import FileUploadInfoRow from './FileUploadInfoRow';

import {locale} from 'config';


export default class FileUploadMetadata extends Component {

    static propTypes = {
        stepperIndex: PropTypes.number.isRequired,
        file: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {stepperIndex, file} = this.props;
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
                        <Field component={TextField} name={`filesDescription-${stepperIndex}`} type="text" fullWidth multiLine
                               rows={3} floatingLabelText={fileInformation.fields.descriptionLabel} maxLength="255" />
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <Toggle name={`filesAccessConditions-${stepperIndex}`}
                                label={fileInformation.fields.accessConditionsLabel}
                                defaultToggled />
                    </div>
                    <div className="column">
                        <Field component={DatePicker} floatingLabelText={fileInformation.fields.embargoDateLabel} fullWidth name={`fileEmbargoDate-${stepperIndex}`} locale="en-AU" DateTimeFormat={DateTimeFormat} />
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
