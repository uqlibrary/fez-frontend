import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import RaisedButton from 'material-ui/RaisedButton';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {FileUploadField} from 'uqlibrary-react-toolbox/build/FileUploader';
import {NavigationDialogBox} from 'uqlibrary-react-toolbox/build/NavigationPrompt';

import {validation} from 'config';
import {default as txt} from 'locale/publicationForm';

export default class ThesisSubmission extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        onFormSubmitSuccess: PropTypes.func.isRequired,
        onFormCancel: PropTypes.func.isRequired
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.props.onFormSubmitSuccess();
        }
    }

    getAlert = ({submitFailed = false, dirty = false, invalid = false, submitting = false, error,
        submitSucceeded = false, alertLocale = {}}) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {...alertLocale.errorAlert, message: alertLocale.errorAlert.message ? alertLocale.errorAlert.message(error) : error};
        } else if (!submitFailed && dirty && invalid) {
            alertProps = {...alertLocale.validationAlert};
        } else if (submitting) {
            alertProps = {...alertLocale.progressAlert};
        } else if (submitSucceeded) {
            alertProps = {...alertLocale.successAlert};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    render() {
        console.log('bla....');
        return (
            <form>
                <NavigationDialogBox when={this.props.dirty && !this.props.submitSucceeded} txt={txt.cancelWorkflowConfirmation} />

                <StandardCard title="Thesis Submission Form"  help={txt.publicationType.help}>
                    <p> Coming soon.... </p>
                </StandardCard>

                <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                    <Field
                        name="files"
                        component={ FileUploadField }
                        disabled={this.props.submitting}
                        requireFileAccess
                        validate={[validation.validFileUpload]} />
                </StandardCard>
                {
                    this.getAlert({...this.props, alertLocale: txt})
                }
                <div className="columns action-buttons">
                    <div className="column is-hidden-mobile"/>
                    <div className="column is-narrow-desktop">
                        <RaisedButton
                            fullWidth
                            label={txt.cancel}
                            disabled={this.props.submitting}
                            onTouchTap={this.props.onFormCancel} />
                    </div>
                    <div className="column is-narrow-desktop">
                        <RaisedButton
                            secondary
                            fullWidth
                            label={txt.submit}
                            onTouchTap={this.props.handleSubmit}
                            disabled={this.props.submitting || this.props.invalid}
                        />
                    </div>
                </div>
            </form>
        );
    }
}
