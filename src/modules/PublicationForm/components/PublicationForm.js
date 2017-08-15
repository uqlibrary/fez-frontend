import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import {SelectField, StandardCard, Alert, ConfirmDialogBox, FileUploadField} from 'uqlibrary-react-toolbox';
import {locale, publicationTypes} from 'config';

import {BookForm, JournalArticleForm} from './Forms';

export default class PublicationForm extends Component {

    static propTypes = {
        ...propTypes, // all redux-form props
        onFormSubmitSuccess: PropTypes.func.isRequired,
        onFormCancel: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        // keep a list of all available forms
        this.formComponents = {BookForm, JournalArticleForm};
        this.publicationTypes = publicationTypes(this.formComponents);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.props.onFormSubmitSuccess();
        }
    }

    _showConfirmation = () => {
        if (this.props.pristine) {
            this.props.onFormCancel();
        } else {
            this.confirmationBox.showConfirmation();
        }
    }

    _getPublicationTypeForm = (publicationTypeId) => {
        const filteredPublicationType = publicationTypeId ?
            this.publicationTypes.filter((item) => { return item.id === publicationTypeId; }) : null;
        return filteredPublicationType && filteredPublicationType.length > 0 && filteredPublicationType[0].formComponent ?
            React.createElement(
                filteredPublicationType[0].formComponent,
                {
                    vocabId: filteredPublicationType[0].vocabId,
                    submitting: true // this.props.submitting
                })
            :
            null;
    };

    render() {
        // populate publication types select box
        const publicationTypeItems = [
            ...(this.publicationTypes.filter((item) => {
                return item.isFavourite;
            }).map((item, index) => {
                return <MenuItem value={item.id} primaryText={item.name} key={'fav_' + index} disabled={!item.formComponent}/>;
            })),
            ...[<Divider key="div_0"/>],
            ...this.publicationTypes.map((item, index) => {
                return <MenuItem value={item.id} primaryText={item.name} key={index} disabled={!item.formComponent}/>;
            })
        ];

        const txt = locale.components.publicationForm;
        return (
            <form>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.props.onFormCancel}
                    locale={txt.cancelWorkflowConfirmation} />

                <StandardCard title={txt.publicationType.title}  help={txt.publicationType.help}>
                    <Field component={SelectField}
                           name="rek_display_type"
                           fullWidth
                           floatingLabelText={txt.publicationType.inputLabelText}
                           floatingLabelFixed
                           className="requiredField"
                           hintText={txt.publicationType.inputLabelText}>
                        {publicationTypeItems}
                    </Field>
                </StandardCard>
                {
                    this._getPublicationTypeForm(this.props.formValues.get('rek_display_type'))
                }
                {
                    this.props.formValues.get('rek_display_type') > 0 &&
                    <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                        <Field name="files" component={ FileUploadField } disabled={this.props.submitting} />
                    </StandardCard>
                }
                {
                    this.props.submitFailed && this.props.error &&
                    <Alert type="error_outline" title="Error" message={this.props.error} outsideLayout />
                }
                {
                    this.props.dirty && this.props.invalid && !this.props.submitFailed &&
                    <Alert type="warning" title="Validation" message={'Form cannot be submitted until all fields are valid...'} outsideLayout />
                }
                {
                    this.props.submitting &&
                    <Alert type="info_outline" title="Saving" message={'New publication is being saved...'} outsideLayout />
                }
                {
                    this.props.submitSucceeded &&
                    <Alert type="info" title="Success" message={'New publication has been saved...'} outsideLayout />
                }
                <div className="layout-card">
                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
                                disabled={this.props.submitting}
                                onTouchTap={this._showConfirmation} />
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
                </div>
            </form>
        );
    }
}
