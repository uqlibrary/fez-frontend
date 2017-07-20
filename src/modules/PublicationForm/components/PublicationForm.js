import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import {FileUploader} from 'modules/SharedComponents';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {SelectField, StandardCard, Alert, ConfirmDialogBox} from 'uqlibrary-react-toolbox';

import {locale} from 'config';

import {BookForm, JournalArticleForm } from './Forms';

export default class PublicationForm extends Component {

    static propTypes = {
        ...propTypes, // all redux-form props
        onFormSubmitSuccess: PropTypes.func.isRequired,
        onFormCancel: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.reset();
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
        switch(publicationTypeId) {
            case 179:
                return (<JournalArticleForm />);
            case 174:
                return (<BookForm />);
            default:
                return (<div/>);
        }
    };

    render() {
        const publicationTypeItems = locale.mapping.publicationTypes.map((item, index) => {
            return <MenuItem value={item.documentId} primaryText={item.name} key={index}/>;
        });
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
                        <FileUploader/>
                    </StandardCard>
                }
                {
                    this.props.submitFailed && this.props.error &&
                    <Alert type="error_outline" title="Error" message={this.props.error} />
                }
                {
                    this.props.dirty && this.props.invalid && !this.props.submitFailed &&
                    <Alert type="help" title="Validation" message={'Form cannot be submitted until all fields are valid...'} />
                }
                {
                    this.props.submitting &&
                    <Alert type="info_outline" title="Saving" message={'New publication is being saved...'} />
                }
                {
                    this.props.submitSucceeded &&
                    <Alert type="info" title="Success" message={'New publication has been saved...'} />
                }
                <div className="layout-card">
                    <div className="columns">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop" style={{marginBottom: 24}}>
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
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
