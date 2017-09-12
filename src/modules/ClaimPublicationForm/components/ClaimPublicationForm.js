import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';
import {TextField, StandardPage, StandardCard, ConfirmDialogBox, Alert, FileUploadField} from 'uqlibrary-react-toolbox';
import PublicationCitation from 'modules/PublicationsList/components/PublicationCitation';
import {AuthorLinkingField} from '../../SharedComponents';
import {validation, locale} from 'config';

export default class ClaimPublicationForm extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected publication for a claim
        this.props.actions.clearClaimPublication();
    }

    _navigateToPreviousPage = () => {
        this.props.history.go(-1);
    }

    _navigateToDashboard = () => {
        // TODO: route should not be hardcoded, should come from config/menu
        // TODO: should navigation be handled by top-level container only, eg pass on as props:
        // TODO: this.props.navigateToDashboard() and this.props.navigateToClaimForm(item) <- fixes issue of linking item
        this.props.history.push('/dashboard');
    };

    _showConfirmation = () => {
        if (this.props.pristine) {
            this._navigateToPreviousPage();
        } else {
            this.cancelConfirmationBox.showConfirmation();
        }
    }

    _handleKeyboardFormSubmit = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.props.handleSubmit();
        }
    };

    render() {
        const txt = locale.components.claimPublicationForm;
        const publication = this.props.initialValues.get('publication') ? this.props.initialValues.get('publication').toJS() : null;
        const author = this.props.initialValues.get('author') ? this.props.initialValues.get('author').toJS() : null;

        if (!author || !publication) {
            this.props.history.go(-1);
            return (<div />);
        }

        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <ConfirmDialogBox
                        onRef={ref => (this.cancelConfirmationBox = ref)}
                        onAction={this._navigateToPreviousPage}
                        locale={txt.cancelWorkflowConfirmation}/>

                    <ConfirmDialogBox
                        onRef={ref => (this.successConfirmationBox = ref)}
                        onAction={this._navigateToDashboard}
                        onCancelAction={this._navigateToPreviousPage}
                        locale={txt.successWorkflowConfirmation}/>

                    <StandardCard title={txt.claimingInformation.title} help={txt.claimingInformation.help}>
                        <PublicationCitation publication={publication}/>
                    </StandardCard>

                    {
                        <StandardCard title={txt.authorLinking.title} help={txt.authorLinking.help}>
                            <div>{txt.authorLinking.text}</div>
                            <Field
                                name="authorLinking"
                                component={AuthorLinkingField}
                                searchKey={{value: 'rek_author_id', order: 'rek_author_id_order'}}
                                loggedInAuthor={author}
                                authorList={publication.fez_record_search_key_author}
                                linkedAuthorIdList={publication.fez_record_search_key_author_id}
                                disabled={this.props.submitting}
                                className="requiredField"
                                validate={[validation.required, validation.isValidAuthorLink]}
                            />
                        </StandardCard>
                    }

                    <StandardCard title={txt.comments.title} help={txt.comments.help}>
                        <Field
                            component={TextField}
                            disabled={this.props.submitting}
                            className="requiredField"
                            name="comments"
                            type="text"
                            fullWidth
                            multiLine
                            rows={1}
                            floatingLabelText={txt.comments.fieldLabels.comments} />

                        <Field
                            component={TextField}
                            disabled={this.props.submitting}
                            name="rek_link"
                            type="text"
                            fullWidth
                            floatingLabelText={txt.comments.fieldLabels.url}
                            validate={[validation.url, validation.maxLength255]} />
                    </StandardCard>

                    <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                        <Field name="files" component={ FileUploadField } disabled={this.props.submitting} requireFileAccess validate={[validation.validFileUpload]} />
                    </StandardCard>
                    {
                        this.props.submitFailed && this.props.error &&
                        <Alert type="error_outline" {...txt.errorAlert} />
                    }
                    {
                        !this.props.submitFailed && this.props.invalid &&
                        <Alert {...txt.validationAlert} type="warning" />
                    }
                    {
                        this.props.submitting &&
                        <Alert type="info_outline" {...txt.progressAlert} />
                    }
                    {
                        this.props.submitSucceeded &&
                        <Alert type="info" {...txt.successAlert} />
                    }
                    <div className="columns">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
                                disabled={this.props.submitting}
                                onTouchTap={this._showConfirmation}/>
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
            </StandardPage>
        );
    }
}
