import React, {PureComponent} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {TextField, AutoCompleteSelect, DatePicker} from 'uqlibrary-react-toolbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

// custom components
import FileUploadInfoRow from './FileUploadInfoRow';
import {locale} from 'config';
import {EMBARGO_ID} from './fileHelper';
import './buttons.scss';


export default class Metadata extends PureComponent {

    static propTypes = {
        dataSource: PropTypes.array.isRequired,
        decreaseStep: PropTypes.func,
        file: PropTypes.object.isRequired,
        form: PropTypes.string.isRequired,
        formValues: PropTypes.object,
        handleSubmit: PropTypes.func,
        increaseStep: PropTypes.func,
        previousPage: PropTypes.func,
        stepperIndex: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            errors: {}
        };
    }

    render() {
        const {
            stepperIndex,
            file,
            formValues,
            previousPage,
            decreaseStep,
            increaseStep,
            handleSubmit
        } = this.props;
        const DateTimeFormat = global.Intl.DateTimeFormat;
        const fileInformation = locale.sharedComponents.files;

        const required = value => value && value.replace(/\s/, '').length > 0 ? undefined : 'This field is required';
        const prevBtnFunc = stepperIndex === 0 ? previousPage : decreaseStep;

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
                               type="text" fullWidth multiLine
                               rows={3}
                               floatingLabelText={fileInformation.fields.descriptionLabel}
                               validate={[required]}
                               maxLength="255" />
                    </div>
                </div>
                <div className="columns">
                    <div className="column ">
                        <Field component={AutoCompleteSelect}
                               label={fileInformation.fields.accessConditionsLabel}
                               name={`${fileInformation.fields.metadata.accessCondition}${stepperIndex}`}
                               dataSource={this.props.dataSource}
                               dataSourceConfig={{text: 'title', value: 'id'}}
                               formValue={formValues.get(`${fileInformation.fields.metadata.accessCondition}${stepperIndex}`)}
                        />
                    </div>
                    <div className="column">
                        <Field component={DatePicker}
                               floatingLabelText={fileInformation.fields.embargoDateLabel}
                               fullWidth
                               name={`${fileInformation.fields.metadata.embargoDate}${stepperIndex}`}
                               locale="en-AU"
                               DateTimeFormat={DateTimeFormat}
                               disabled={formValues.get(`${fileInformation.fields.metadata.accessCondition}${stepperIndex}`) !== EMBARGO_ID}
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
                        label={fileInformation.buttons.backLabel}
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