import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form/immutable';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { GrantListEditorField } from 'modules/SharedComponents/GrantListEditor';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';

import { general, validation, routes } from 'config';
import { default as pagesLocale } from 'locale/pages';
import { default as formsLocale } from 'locale/forms';
import { default as componentsLocale } from 'locale/components';
import {
    DOCUMENT_TYPE_DESIGN, DOCUMENT_TYPE_JOURNAL_ARTICLE, DOCUMENT_TYPE_BOOK_CHAPTER, DOCUMENT_TYPE_BOOK, DOCUMENT_TYPE_RESEARCH_REPORT, DOCUMENT_TYPE_CREATIVE_WORK,
    CW_NTRO_SUBTYPES, LP_NTRO_SUBTYPES, RRW_NTRO_SUBTYPES, CPEE_NTRO_SUBTYPES, RESEARCH_REPORT_NTRO_SUBTYPES, NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK
} from 'config/general';


export default class MyIncompleteRecord extends PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        disableSubmit: PropTypes.bool,

        recordToFix: PropTypes.object,
        loadingRecordToFix: PropTypes.bool,

        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,

        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,

        publicationToFixFileUploadingError: PropTypes.bool,

        errors: PropTypes.object
    };

    componentDidMount() {
        if (!!this.props.actions && !this.props.recordToFix &&
            !!this.props.match.params && !!this.props.match.params.pid) {
            this.props.actions.loadRecordToFix(this.props.match.params.pid);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected recordToFix for a fix
        this.props.actions.clearFixRecord();
    }

    _navigateToMyIncomplete = () => {
        this.props.history.push(routes.pathConfig.records.incomplete);
    };

    _navigateToDashboard = () => {
        this.props.history.push(routes.pathConfig.dashboard);
    };

    isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
        return !!author && !!recordToFix && recordToFix[searchKey] && recordToFix[searchKey].length > 0
            && recordToFix[searchKey].filter(authorId => authorId[subkey] === author.aut_id).length > 0;
    };

    isAuthorLinked = () => {
        const isAuthorLinked = this.isLoggedInUserLinked(this.props.author, this.props.recordToFix, 'fez_record_search_key_author_id', 'rek_author_id');
        const isContributorLinked = this.isLoggedInUserLinked(this.props.author, this.props.recordToFix, 'fez_record_search_key_contributor_id', 'rek_contributor_id');

        return isAuthorLinked || isContributorLinked;
    };

    _cancelFix = () => {
        this.props.history.goBack();
    };

    _actionSelected = (event, value) => {
        this.setState({
            selectedRecordAction: value
        });
    };

    _setSuccessConfirmation = (ref) => {
        this.successConfirmationBox = ref;
    };

    _handleDefaultSubmit = (event) => {
        if (event) event.preventDefault();
    };

    render() {
        // if author is not linked to this record, abandon form
        // if (!(this.props.accountAuthorLoading || this.props.loadingRecordToFix) && !this.isAuthorLinked()) {
        //     this.props.history.go(-1);
        //     return <div />;
        // }

        const isNtro = !!this.props.recordToFix && !!this.props.recordToFix.rek_subtype && !!general.NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype);

        // see https://docs.google.com/spreadsheets/d/1JOWQeFepCs7DWaiMY50yKacxbO_okgolJjeFc2nlMx8/edit#gid=0 for the cross reference of which fields are mandatory on which types
        const isDocumentType1 = !!this.props.recordToFix && !!this.props.recordToFix.rek_display_type_lookup && !!this.props.recordToFix.rek_subtype &&
            (
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_DESIGN && !!this.props.recordToFix.rek_subtype && this.props.recordToFix.rek_subtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK) ||
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_BOOK && !!this.props.recordToFix.rek_subtype && CW_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype)) ||
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_CREATIVE_WORK && !!this.props.recordToFix.rek_subtype && CW_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype)) ||
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_CREATIVE_WORK && !!this.props.recordToFix.rek_subtype && RRW_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype)) ||
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_RESEARCH_REPORT && !!this.props.recordToFix.rek_subtype && RESEARCH_REPORT_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype))
            );

        const isDocumentType2 = (!!this.props.recordToFix &&  this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_CREATIVE_WORK && !!this.props.recordToFix.rek_subtype
            && (LP_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype) || CPEE_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype))
        );

        const isDocumentType3 = !!this.props.recordToFix &&
            (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_BOOK_CHAPTER || this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_JOURNAL_ARTICLE)
            && !!this.props.recordToFix.rek_subtype && CW_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype);

        // rek_formatted_abstract
        const editAbstract = (isDocumentType1 || isDocumentType2 || isDocumentType3) &&
            (!this.props.recordToFix || !this.props.recordToFix.rek_formatted_abstract);

        // fez_record_search_key_audience_size
        const editAudienceSize = isDocumentType2 &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_audience_size || !this.props.recordToFix.fez_record_search_key_audience_size.rek_audience_size);

        // fez_record_search_key_creator_contribution_statement
        const editCreatorContributionStatement = (isDocumentType1 || isDocumentType2 || isDocumentType3) &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_creator_contribution_statement ||
                this.props.recordToFix.fez_record_search_key_creator_contribution_statement.length === 0);

        // fez_record_search_key_language
        const editLanguage = !this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_language || !this.props.recordToFix.fez_record_search_key_language || !this.props.recordToFix.fez_record_search_key_language || this.props.recordToFix.fez_record_search_key_language.length === 0;
        const defaultLanguage = !!this.props.recordToFix && !!this.props.recordToFix.fez_record_search_key_language
            && this.props.recordToFix.fez_record_search_key_language.length > 0
            && this.props.recordToFix.fez_record_search_key_language[0].rek_language
         || 'eng';

        // fez_record_search_key_quality_indicator
        const editQualityIndicator = (isDocumentType1 || isDocumentType2 || isDocumentType3) &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_quality_indicator || this.props.recordToFix.fez_record_search_key_quality_indicator.length === 0);

        // fez_record_search_key_significance
        const editSignificance = (isDocumentType1 || isDocumentType2 || isDocumentType3) &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_significance || this.props.recordToFix.fez_record_search_key_significance.length === 0);

        // fez_record_search_key_total_pages
        const editExtent = (isDocumentType1 || isDocumentType2) &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_total_pages || !this.props.recordToFix.fez_record_search_key_total_pages.rek_total_pages);

        const txt = pagesLocale.pages.incompletePublication;
        const txtFixForm = formsLocale.forms.fixPublicationForm;
        const authors = componentsLocale.components.authors;
        authors.description = txt.fields.authors.description;
        authors.field.form.locale.descriptionStep1 = txt.fields.authors.updateAuthor;
        authors.field.header.locale.descriptionStep2 = txt.fields.authors.selectAuthor;
        authors.field.row.locale.selectHint = txt.fields.authors.ariaLabel;

        if (this.props.accountAuthorLoading || this.props.loadingRecordToFix) {
            return (
                <React.Fragment>
                    <InlineLoader message={txt.loadingMessage} />
                </React.Fragment>
            );
        }

        // set confirmation message depending on file upload status
        const saveConfirmationLocale = { ...txt.successWorkflowConfirmation };
        saveConfirmationLocale.confirmationMessage = (
            <React.Fragment>
                {this.props.publicationToFixFileUploadingError && <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />}
                {saveConfirmationLocale.confirmationMessage}
            </React.Fragment>
        );
        const hasAnyFiles = this.props.recordToFix && this.props.recordToFix.fez_datastream_info && this.props.recordToFix.fez_datastream_info.length || 0;
        return (
            <StandardPage title={txt.title}>
                <PublicationCitation publication={this.props.recordToFix} />
                {
                    // TODO remove before going live
                    !!this.props.recordToFix && !!this.props.recordToFix.rek_display_type_lookup ?
                        <p><b>Display Type</b> (for dev): {this.props.recordToFix.rek_display_type_lookup}</p>
                        : <p><b>Display Type</b> (for dev): missing</p>
                }
                {
                    // TODO remove before going live
                    !!this.props.recordToFix && !!this.props.recordToFix.rek_subtype ?
                        <p><b>Subtype</b> (for dev) : {this.props.recordToFix.rek_subtype}</p>
                        : <p><b>Subtype</b> (for dev) : missing</p>
                }

                <form onSubmit={this._handleDefaultSubmit}>
                    <NavigationDialogBox when={this.props.dirty && !this.props.submitSucceeded} txt={txtFixForm.cancelWorkflowConfirmation} />
                    <ConfirmDialogBox
                        onRef={this._setSuccessConfirmation}
                        onCancelAction={this._navigateToMyIncomplete}
                        onAction={this._navigateToDashboard}
                        locale={saveConfirmationLocale}
                    />
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <Alert
                                title="Missing data"
                                message="This record has missing data - enter all fields to give a quality record."
                                type="info_outline"
                            />
                        </Grid>
                        {
                            isNtro &&
                            (editCreatorContributionStatement || editAbstract || editExtent || editAudienceSize || editSignificance || editQualityIndicator || editLanguage) &&
                            <NtroFields
                                submitting={this.props.submitting}
                                showContributionStatement={editCreatorContributionStatement}
                                hideIsmn
                                hideIsrc
                                hideVolume
                                hideIssue
                                hideStartPage
                                hideEndPage
                                hideExtent={!editExtent}
                                hideOriginalFormat
                                hideAbstract={!editAbstract}
                                hideAudienceSize={!editAudienceSize}
                                showSignificance={editSignificance}
                                hidePeerReviewActivity={!editQualityIndicator}
                                hideLanguage={!editLanguage}
                                defaultLanguage={defaultLanguage}
                                hideSeries
                                hideGrants
                            />
                        }
                        <Grid item xs={12}>
                            <StandardCard title={txt.fields.grants.title}>
                                <Field
                                    component={GrantListEditorField}
                                    name="grants"
                                    disabled={this.props.submitting}
                                    disableDeleteAllGrants={this.props.disableDeleteAllGrants}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={authors.title} help={authors.help}>
                                <Typography>{authors.description}</Typography>
                                <Field
                                    component={ContributorsEditorField}
                                    editMode
                                    hideDelete
                                    hideReorder
                                    isNtro={isNtro}
                                    locale={authors.field}
                                    name="authors"
                                    required
                                    showContributorAssignment
                                    validate={[validation.authorsAffiliationIncomplete]}
                                />
                            </StandardCard>
                        </Grid>

                        <Grid item xs={12}>
                            <StandardCard title={txt.fields.notes.title}>
                                <Field
                                    component={TextField}
                                    name="notes"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    multiline
                                    rows={5}
                                    label={txt.fields.notes.label}
                                    placeholder={txt.fields.notes.placeholder}
                                />
                            </StandardCard>
                        </Grid>
                        {
                            !hasAnyFiles &&
                            <Grid item xs={12}>
                                <StandardCard title={txt.fields.fileUpload.title}>
                                    <Field
                                        name="files"
                                        component={FileUploadField}
                                        disabled={this.props.submitting}
                                        requireOpenAccessStatus
                                        validate={[validation.validFileUpload]}
                                        isNtro
                                        {...txt.fields.fileUpload}
                                    />
                                </StandardCard>
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs />
                        <Grid item>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={txt.cancelButtonLabel}
                                disabled={this.props.submitting}
                                onClick={this._cancelFix} />
                        </Grid>
                        <Grid item>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={txt.submitButtonLabel}
                                onClick={this.props.handleSubmit}
                                disabled={this.props.submitting || this.props.disableSubmit} />
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
