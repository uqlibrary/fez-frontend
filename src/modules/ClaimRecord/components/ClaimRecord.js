import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';
import {TextField, StandardPage, StandardCard, Alert, ConfirmDialogBox, FileUploadField} from 'uqlibrary-react-toolbox';
import {PublicationCitation} from 'modules/SharedComponents/PublicationsList';
import {AuthorLinkingField} from 'modules/SharedComponents/AuthorLinking';
import {validation, locale, routes} from 'config';
import {Prompt} from 'react-router-dom';

export default class ClaimRecord extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const publication = this.props.initialValues.get('publication') ? this.props.initialValues.get('publication').toJS() : null;
        const author = this.props.initialValues.get('author') ? this.props.initialValues.get('author').toJS() : null;

        if (!author || !publication) {
            this.props.history.go(-1);
        }
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

    _navigateToMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    }

    _navigateToAddRecord = () => {
        this.props.history.push(routes.pathConfig.records.add.find);
    }

    _navigateToPossibleMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.possible);
    }

    _showConfirmation = () => {
        if (this.props.pristine) {
            if (!!this.props.initialValues.get('publication').get('sources')) {
                this._navigateToAddRecord();
            } else {
                this._navigateToPossibleMyResearch();
            }
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

    getAlert = ({submitFailed = false, error, dirty = false, invalid = false, submitting = false, submitSucceeded = false, txt, authorLinked = false}, contributorLinked = false) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {...txt.errorAlert};
        } else if (!submitFailed && dirty && invalid) {
            alertProps = {...txt.validationAlert};
        } else if (submitting) {
            alertProps = {...txt.progressAlert};
        } else if (submitSucceeded) {
            alertProps = {...txt.successAlert};
        } else if (authorLinked || contributorLinked) {
            alertProps = {...txt.alreadyClaimedAlert};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    _setSuccessConfirmation = (ref) => {
        this.successConfirmationBox = ref;
    };

    _setCancelConfirmation = (ref) => {
        this.cancelConfirmationBox = ref;
    };

    render() {
        const txt = locale.components.claimPublicationForm;
        const publication = this.props.initialValues.get('publication') ? this.props.initialValues.get('publication').toJS() : null;
        const author = this.props.initialValues.get('author') ? this.props.initialValues.get('author').toJS() : null;
        if (!author || !publication) {
            return (<div />);
        }
        const authorLinked = publication && author && publication.fez_record_search_key_author_id && publication.fez_record_search_key_author_id.length > 0 &&
            publication.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === author.aut_id).length > 0;
        const contributorLinked = publication && author && publication.fez_record_search_key_contributor_id && publication.fez_record_search_key_contributor_id.length > 0 &&
            publication.fez_record_search_key_contributor_id.filter(authorId => authorId.rek_contributor_id === author.aut_id).length > 0;

        const fromAddRecord = !!publication.sources;
        // console.log('Publication : ' + JSON.stringify(publication));
        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <StandardCard title={txt.claimingInformation.title} help={txt.claimingInformation.help}>
                        <PublicationCitation publication={publication}/>
                    </StandardCard>
                    {
                        (!publication.rek_pid || !authorLinked) &&
                        <div>
                            <ConfirmDialogBox
                                onRef={this._setCancelConfirmation}
                                onAction={fromAddRecord ? this._navigateToAddRecord : this._navigateToPossibleMyResearch}
                                locale={txt.cancelWorkflowConfirmation}/>

                            <ConfirmDialogBox
                                onRef={this._setSuccessConfirmation}
                                onAction={this._navigateToMyResearch}
                                onCancelAction={fromAddRecord ? this._navigateToAddRecord : this._navigateToPossibleMyResearch}
                                locale={{
                                    ...txt.successWorkflowConfirmation,
                                    cancelButtonLabel: fromAddRecord
                                        ? txt.successWorkflowConfirmation.addRecordButtonLabel
                                        : txt.successWorkflowConfirmation.cancelButtonLabel}} />

                            <Prompt when={this.props.dirty} message={locale.global.discardFormChangesConfirmation.confirmationMessage}/>

                            {
                                publication.fez_record_search_key_author &&
                                publication.fez_record_search_key_author.length > 1 &&
                                !authorLinked &&
                                <StandardCard
                                    title={txt.authorLinking.title}
                                    help={txt.authorLinking.help}
                                    className="requiredField">
                                    <label htmlFor="authorLinking">{txt.authorLinking.text}</label>
                                    <Field
                                        name="authorLinking"
                                        component={AuthorLinkingField}
                                        searchKey={{
                                            value: 'rek_author_id',
                                            order: 'rek_author_id_order',
                                            type: 'author'
                                        }}
                                        loggedInAuthor={author}
                                        authorList={publication.fez_record_search_key_author}
                                        linkedAuthorIdList={publication.fez_record_search_key_author_id}
                                        disabled={this.props.submitting}
                                        className="requiredField"
                                        validate={[validation.required, validation.isValidAuthorLink]}
                                    />
                                </StandardCard>
                            }

                            {
                                publication.fez_record_search_key_author.length === 0 &&
                                publication.fez_record_search_key_contributor &&
                                publication.fez_record_search_key_contributor.length > 1 &&
                                !contributorLinked &&
                                <StandardCard
                                    title={txt.contributorLinking.title}
                                    help={txt.contributorLinking.help}
                                    className="requiredField">
                                    <label htmlFor="contributorLinking">{txt.contributorLinking.text}</label>
                                    <Field
                                        name="contributorLinking"
                                        component={AuthorLinkingField}
                                        searchKey={{
                                            value: 'rek_contributor_id',
                                            order: 'rek_contributor_id_order',
                                            type: 'contributor'
                                        }}
                                        loggedInAuthor={author}
                                        authorList={publication.fez_record_search_key_contributor}
                                        linkedAuthorIdList={publication.fez_record_search_key_contributor_id}
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
                                    name="comments"
                                    type="text"
                                    fullWidth
                                    multiLine
                                    rows={1}
                                    floatingLabelText={txt.comments.fieldLabels.comments}/>

                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_link"
                                    type="text"
                                    fullWidth
                                    floatingLabelText={txt.comments.fieldLabels.url}
                                    validate={[validation.url]}/>
                            </StandardCard>

                            <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                                <Field
                                    name="files"
                                    component={ FileUploadField }
                                    disabled={this.props.submitting}
                                    requireFileAccess
                                    validate={[validation.validFileUpload]}
                                />
                            </StandardCard>
                        </div>
                    }

                    {
                        this.getAlert({...this.props, txt: txt, authorLinked: publication.rek_pid && authorLinked})
                    }

                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
                                disabled={this.props.submitting}
                                onTouchTap={this._showConfirmation}/>
                        </div>
                        {
                            (!publication.rek_pid || !authorLinked) &&
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
            </StandardPage>
        );
    }
}
