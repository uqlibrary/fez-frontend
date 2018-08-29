import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/Core/Button';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';
import {NavigationDialogBox} from 'modules/SharedComponents/Toolbox/NavigationPrompt';

import {publicationTypes, validation} from 'config';
import {default as txt} from 'locale/publicationForm';

import * as recordForms from './Forms';

export default class PublicationForm extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        disableSubmit: PropTypes.bool,
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
        const {formValues} = this.props;
        const filteredPublicationType = publicationTypeId ?
            this.publicationTypes.filter((item) => { return item.id === publicationTypeId; }) : null;
        return filteredPublicationType && filteredPublicationType.length > 0 && filteredPublicationType[0].formComponent ?
            React.createElement(
                filteredPublicationType[0].formComponent,
                {
                    subtypeVocabId: filteredPublicationType[0].subtypeVocabId,
                    submitting: this.props.submitting,
                    formValues
                })
            :
            null;
    };

    _handleDefaultSubmit = (event) => {
        if(event) event.preventDefault();
    };

    render() {
        const publicationTypeItems = [
            ...(this.publicationTypes.filter((item) => {
                return item.isFavourite;
            }).map((item, index) => {
                return <MenuItem value={item.id} key={'fav_' + index} disabled={!item.formComponent}>{item.name}</MenuItem>;
            })),
            ...[<Divider key="div_0"/>],
            ...this.publicationTypes.filter((item) => {
                return item.hasFormComponent;
            }).map((item, index) => {
                return <MenuItem value={item.id} key={index} disabled={!item.formComponent}>{item.name}</MenuItem>;
            })
        ];
        const alertProps = validation.getErrorAlertProps({...this.props, alertLocale: txt});
        return (
            <form onSubmit={this._handleDefaultSubmit}>
                <NavigationDialogBox when={this.props.dirty && !this.props.submitSucceeded} txt={txt.cancelWorkflowConfirmation} />
                <StandardCard title={txt.publicationType.title}  help={txt.publicationType.help}>
                    <Field
                        component={SelectField}
                        disabled={this.props.submitting}
                        name="rek_display_type"
                        value={this.props.formValues.get('rek_display_type')}
                        label={txt.publicationType.inputLabelText}
                        required
                        placeholder={txt.publicationType.hintText}>
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
                    alertProps &&
                    <Alert {...alertProps} />
                }
                <div className="columns action-buttons">
                    <div className="column is-hidden-mobile"/>
                    <div className="column is-narrow-desktop">
                        <Button
                            variant={'raised'}
                            color={'secondary'}
                            fullWidth
                            children={txt.cancel}
                            disabled={this.props.submitting}
                            onClick={this.props.onFormCancel} />
                    </div>
                    {this.props.formValues.get('rek_display_type') > 0 &&
                    <div className="column is-narrow-desktop">
                        <Button
                            variant={'raised'}
                            color={'primary'}
                            fullWidth
                            children={txt.submit}
                            onClick={this.props.handleSubmit}
                            disabled={this.props.submitting || this.props.disableSubmit}/>
                    </div>
                    }
                </div>
            </form>
        );
    }
}
