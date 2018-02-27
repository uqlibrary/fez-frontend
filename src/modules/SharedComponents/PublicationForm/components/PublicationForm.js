import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {SelectField} from 'uqlibrary-react-toolbox/build/SelectField';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {FileUploadField} from 'uqlibrary-react-toolbox/build/FileUploader';
import {NavigationDialogBox} from 'uqlibrary-react-toolbox/build/NavigationPrompt';

import {publicationTypes, validation} from 'config';
import {default as txt} from 'locale/publicationForm';
import {validationErrorsSummary} from 'locale/validationErrors';

import * as recordForms from './Forms';

export default class PublicationForm extends Component {
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
        this.publicationTypes = publicationTypes({...recordForms});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.props.onFormSubmitSuccess();
        }
    }

    _getPublicationTypeForm = (publicationTypeId) => {
        const filteredPublicationType = publicationTypeId ?
            this.publicationTypes.filter((item) => { return item.id === publicationTypeId; }) : null;
        return filteredPublicationType && filteredPublicationType.length > 0 && filteredPublicationType[0].formComponent ?
            React.createElement(
                filteredPublicationType[0].formComponent,
                {
                    subtypeVocabId: filteredPublicationType[0].subtypeVocabId,
                    submitting: this.props.submitting
                })
            :
            null;
    };

    getAlert = ({submitFailed = false, dirty = false, invalid = false, submitting = false, error, formErrors,
        submitSucceeded = false, alertLocale = {}}) => {
        let alertProps = null;
        const errorMessagesList = formErrors ? this.translateFormErrorsToText(formErrors) : null;

        if (submitFailed && error) {
            alertProps = {...alertLocale.errorAlert, message: alertLocale.errorAlert.message ? alertLocale.errorAlert.message(error) : error};
        } else if (!submitFailed && dirty && invalid) {
            const message = (
                <span>
                    {alertLocale.validationAlert.message}
                    <ul>
                        {
                            errorMessagesList && errorMessagesList.length > 0 && errorMessagesList.map((item, index) => (
                                <li key={`validation-${index}`}>{item}</li>
                            ))
                        }
                    </ul>
                </span>);

            alertProps = {...alertLocale.validationAlert, message: message};
        } else if (submitting) {
            alertProps = {...alertLocale.progressAlert};
        } else if (submitSucceeded) {
            alertProps = {...alertLocale.successAlert};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    translateFormErrorsToText = (formErrors) => {
        let errorMessagesList = [];

        Object.keys(formErrors).map(key => {
            const value = formErrors[key];
            if (typeof value === 'object') {
                const errorMessage = this.translateFormErrorsToText(value);
                if (errorMessage) {
                    errorMessagesList = errorMessagesList.concat(errorMessage);
                }
            }

            if (validationErrorsSummary.hasOwnProperty(key)) {
                errorMessagesList.push(validationErrorsSummary[key]);
            }
        });

        return errorMessagesList.length > 0 ? errorMessagesList : null;
    };

    render() {
        const publicationTypeItems = [
            ...(this.publicationTypes.filter((item) => {
                return item.isFavourite;
            }).map((item, index) => {
                return <MenuItem value={item.id} primaryText={item.name} key={'fav_' + index} disabled={!item.formComponent}/>;
            })),
            ...[<Divider key="div_0"/>],
            ...this.publicationTypes.filter((item) => {
                return item.hasFormComponent;
            }).map((item, index) => {
                return <MenuItem value={item.id} primaryText={item.name} key={index} disabled={!item.formComponent}/>;
            })
        ];
        return (
            <form>
                <NavigationDialogBox when={this.props.dirty && !this.props.submitSucceeded} txt={txt.cancelWorkflowConfirmation} />

                <StandardCard title={txt.publicationType.title}  help={txt.publicationType.help}>
                    <Field
                        component={SelectField}
                        disabled={this.props.submitting}
                        name="rek_display_type"
                        {...this.context.selectFieldMobileOverrides}
                        floatingLabelText={txt.publicationType.inputLabelText}
                        floatingLabelFixed
                        className="requiredField"
                        hintText={txt.publicationType.hintText}>
                        {publicationTypeItems}
                    </Field>
                </StandardCard>
                {
                    this._getPublicationTypeForm(this.props.formValues.get('rek_display_type'))
                }
                {
                    this.props.formValues.get('rek_display_type') > 0 &&
                    <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                        <Field
                            name="files"
                            component={ FileUploadField }
                            disabled={this.props.submitting}
                            requireOpenAccessStatus
                            validate={[validation.validFileUpload]} />
                    </StandardCard>
                }
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
                    {this.props.formValues.get('rek_display_type') > 0 &&
                    <div className="column is-narrow-desktop">
                        <RaisedButton
                            secondary
                            fullWidth
                            label={txt.submit}
                            onTouchTap={this.props.handleSubmit}
                            disabled={this.props.submitting || this.props.invalid}
                        />
                    </div>
                    }
                </div>
            </form>
        );
    }
}
