import React, {PureComponent} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {TextField, DatePicker, Toggle} from 'uqlibrary-react-toolbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

// custom components
import FileUploadInfoRow from './FileUploadInfoRow';
import {locale} from 'config';
import './buttons.scss';


export default class Metadata extends PureComponent {

    static propTypes = {
        closeDialog: PropTypes.func,
        dataSource: PropTypes.array.isRequired,
        decreaseStep: PropTypes.func,
        file: PropTypes.object.isRequired,
        form: PropTypes.string.isRequired,
        formValues: PropTypes.object,
        handleSubmit: PropTypes.func,
        increaseStep: PropTypes.func,
        reset: PropTypes.func,
        stepperIndex: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            errors: {}
        };
    }

    cancelFileUpload = () => {
        const {closeDialog, reset} = this.props;

        closeDialog();
        reset(); // resets the redux form fields in the dialog. Function available in redux-form itself
    };

    render() {
        const {
            stepperIndex,
            file,
            formValues,
            decreaseStep,
            increaseStep,
            handleSubmit
        } = this.props;
        const DateTimeFormat = global.Intl.DateTimeFormat;
        const fileInformation = locale.sharedComponents.files;

        const defaultDate = new Date();
        defaultDate.setHours(0, 0, 0, 0);

        const required = value => value && value.replace(/\s/, '').length > 0 ? undefined : 'This field is required';
        const prevBtnLabel = stepperIndex === 0 ? locale.global.labels.buttons.cancel : fileInformation.buttons.backLabel;
        const prevBtnFunc = stepperIndex === 0 ? this.cancelFileUpload : decreaseStep;

        return (
            <form onSubmit={handleSubmit(increaseStep)}>
                <div className="columns">
                    <div className="column">
                        <FileUploadInfoRow key={file.name} file={file} />
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <Field component={TextField}
                               name={`${fileInformation.fields.metadata.description}${stepperIndex}`}
                               type="text" fullWidth
                               floatingLabelText={fileInformation.fields.descriptionLabel}
                               validate={[required]}
                               maxLength="255" />
                    </div>
                </div>
                <div className="columns">
                    <div className="column ">
                        <Field component={Toggle}
                               label={fileInformation.fields.accessConditionsLabel}
                               name={`${fileInformation.fields.metadata.accessCondition}${stepperIndex}`}
                               thumbStyle={{backgroundColor: 'white'}}
                               trackStyle={{backgroundColor: '#595959'}}
                               thumbSwitchedStyle={{backgroundColor: '#2377CB'}}
                               trackSwitchedStyle={{backgroundColor: '#288BED'}}
                        />
                    </div>
                    <div className="column">
                        <Field component={DatePicker}
                               floatingLabelText={fileInformation.fields.embargoDateLabel}
                               fullWidth
                               name={`${fileInformation.fields.metadata.embargoDate}${stepperIndex}`}
                               locale="en-AU"
                               DateTimeFormat={DateTimeFormat}
                               disabled={!formValues.get(`${fileInformation.fields.metadata.accessCondition}${stepperIndex}`)}
                               minDate={defaultDate}
                        />
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        {fileInformation.dialog.disclaimer}
                    </div>
                </div>
                <div className="buttonsContainer">
                    <FlatButton
                        className="prevBtn"
                        label={prevBtnLabel}
                        onTouchTap={prevBtnFunc}
                    />
                    <RaisedButton
                        label={fileInformation.buttons.stepperNextLabel}
                        secondary
                        type="submit"
                    />
                </div>
            </form>
        );
    }
}
