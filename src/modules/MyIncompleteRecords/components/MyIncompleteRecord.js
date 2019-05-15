import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form/immutable';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
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
import { default as viewRecordLocale } from 'locale/viewRecord';
import { default as alertLocale } from 'locale/publicationForm';

import locale from 'locale/global';

import {
    CPEE_NTRO_SUBTYPES,
    CW_NTRO_SUBTYPES,
    DOCUMENT_TYPE_BOOK_CHAPTER,
    DOCUMENT_TYPE_BOOK,
    DOCUMENT_TYPE_CREATIVE_WORK,
    DOCUMENT_TYPE_DESIGN,
    DOCUMENT_TYPE_JOURNAL_ARTICLE,
    DOCUMENT_TYPE_RESEARCH_REPORT,
    LP_NTRO_SUBTYPES,
    NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
    RESEARCH_REPORT_NTRO_SUBTYPES,
    RRW_NTRO_SUBTYPES,
} from 'config/general';
import {pathConfig} from 'config/routes';

import {withStyles} from '@material-ui/core/styles';

export const styles = (theme) => ({
    GridType: {
        paddingBottom: 12,
        borderBottom: `1px solid ${theme.palette.secondary.light}`
    },
    GridSubType: {
        marginTop: 12,
        paddingBottom: 12,
        borderBottom: `1px solid ${theme.palette.secondary.light}`
    }
});

export class MyIncompleteRecordClass extends PureComponent {
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

        errors: PropTypes.object,
        classes: PropTypes.object
    };

    componentDidMount() {
        if (
            !!this.props.actions &&
            !this.props.recordToFix &&
            !!this.props.match.params &&
            !!this.props.match.params.pid
        ) {
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
        return !!author &&
            !!recordToFix &&
            recordToFix[searchKey] &&
            recordToFix[searchKey].length > 0
            && recordToFix[searchKey].some(authorId => (
                authorId[subkey] === author.aut_id
            ))
        ;
    };

    isAuthorLinked = () => {
        const isAuthorLinked = this.isLoggedInUserLinked(
            this.props.author,
            this.props.recordToFix,
            'fez_record_search_key_author_id',
            'rek_author_id'
        );
        const isContributorLinked = this.isLoggedInUserLinked(
            this.props.author,
            this.props.recordToFix,
            'fez_record_search_key_contributor_id',
            'rek_contributor_id'
        );

        return isAuthorLinked || isContributorLinked;
    };

    currentAuthorIndex = () => {
        const author = this.props.recordToFix && this.props.recordToFix.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === this.props.author.aut_id);
        return author.length > 0 && author[0].rek_author_id_order - 1;
    };

    currentAuthorOrder = () => {
        const author = this.props.recordToFix && this.props.recordToFix.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === this.props.author.aut_id);
        return author.length > 0 && author[0].rek_author_id_order;
    };

    _cancelFix = () => {
        this.props.history.push(pathConfig.records.incomplete);
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
        if (!(
            this.props.accountAuthorLoading ||
            this.props.loadingRecordToFix
        ) && !this.isAuthorLinked()) {
            this.props.history.go(-1);
            return <div />;
        }

        const txt = pagesLocale.pages.incompletePublication;
        const txtFixForm = formsLocale.forms.fixPublicationForm;
        const authors = txt.fields.authors;

        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                ...alertLocale,
                progressAlert: txt.progressAlert,
                successAlert: txt.successAlert
            }
        });

        const isNtro = !!this.props.recordToFix &&
            !!this.props.recordToFix.rek_subtype &&
            !!general.NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype)
        ;

        // see https://docs.google.com/spreadsheets/d/1JOWQeFepCs7DWaiMY50yKacxbO_okgolJjeFc2nlMx8/edit#gid=0 for the cross reference of which fields are mandatory on which types
        const isDocumentType1 = !!this.props.recordToFix &&
            !!this.props.recordToFix.rek_display_type_lookup &&
            !!this.props.recordToFix.rek_subtype &&
            ((displayType, subType) => (
                (displayType === DOCUMENT_TYPE_DESIGN && subType === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK) ||
                (displayType === DOCUMENT_TYPE_BOOK && CW_NTRO_SUBTYPES.includes(subType)) ||
                (displayType === DOCUMENT_TYPE_CREATIVE_WORK && CW_NTRO_SUBTYPES.includes(subType)) ||
                (displayType === DOCUMENT_TYPE_CREATIVE_WORK && RRW_NTRO_SUBTYPES.includes(subType)) ||
                (displayType === DOCUMENT_TYPE_RESEARCH_REPORT && RESEARCH_REPORT_NTRO_SUBTYPES.includes(subType))
            ))(this.props.recordToFix.rek_display_type_lookup, this.props.recordToFix.rek_subtype);

        const isDocumentType2 = (
            !!this.props.recordToFix &&
            this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_CREATIVE_WORK &&
            !!this.props.recordToFix.rek_subtype && (
                LP_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype) ||
                CPEE_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype)
            )
        );

        const isDocumentType3 = !!this.props.recordToFix && (
            this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_BOOK_CHAPTER ||
            this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_JOURNAL_ARTICLE
        ) &&
            !!this.props.recordToFix.rek_subtype &&
            CW_NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype)
        ;

        // rek_formatted_abstract
        const editAbstract = (
            isDocumentType1 ||
            isDocumentType2 ||
            isDocumentType3
        ) && (
            !this.props.recordToFix || (
                !this.props.recordToFix.rek_formatted_abstract &&
                !this.props.recordToFix.rek_description
            )
        );

        // fez_record_search_key_audience_size
        const editAudienceSize = isDocumentType2 && (
            !this.props.recordToFix ||
            !this.props.recordToFix.fez_record_search_key_audience_size ||
            !this.props.recordToFix.fez_record_search_key_audience_size.rek_audience_size
        );

        // fez_record_search_key_significance
        const editSignificance = (
            isDocumentType1 ||
            isDocumentType2 ||
            isDocumentType3
        ) && (
            !this.props.recordToFix ||
            !this.props.recordToFix.fez_record_search_key_significance ||
            this.props.recordToFix.fez_record_search_key_significance.length === 0 ||
            this.props.recordToFix.fez_record_search_key_significance.map(item => {
                if(item.rek_significance_order === this.currentAuthorOrder()) {
                    console.log('Author order on record: ', this.currentAuthorOrder(), 'item.rek_significance', item.rek_significance);
                    return (!item.rek_significance || item.rek_significance === 0);
                } else {
                    return false;
                }
            })[this.props.recordToFix.fez_record_search_key_significance.length === this.props.recordToFix.fez_record_search_key_author.length ? this.currentAuthorIndex() : 0]
        );

        // fez_record_search_key_creator_contribution_statement
        const editCreatorContributionStatement = (
            isDocumentType1 ||
            isDocumentType2 ||
            isDocumentType3
        ) && (
            !this.props.recordToFix ||
            !this.props.recordToFix.fez_record_search_key_creator_contribution_statement ||
            this.props.recordToFix.fez_record_search_key_creator_contribution_statement.length === 0 ||
            // Check the current users statement is not missing, empty or null
            this.props.recordToFix.fez_record_search_key_creator_contribution_statement.map(item => {
                if(item.rek_creator_contribution_statement_order === this.currentAuthorOrder()) {
                    return (!item.rek_creator_contribution_statement ||  item.rek_creator_contribution_statement === '' || item.rek_creator_contribution_statement === locale.global.defaultContributorStatementMissing);
                } else {
                    return false;
                }
            })[this.props.recordToFix.fez_record_search_key_creator_contribution_statement.length === this.props.recordToFix.fez_record_search_key_author.length ? this.currentAuthorIndex() : 0]
        );

        // fez_record_search_key_language
        const editLanguage = !this.props.recordToFix ||
            !this.props.recordToFix.fez_record_search_key_language ||
            this.props.recordToFix.fez_record_search_key_language.length === 0
        ;
        const defaultLanguage = !!this.props.recordToFix &&
            !!this.props.recordToFix.fez_record_search_key_language &&
            this.props.recordToFix.fez_record_search_key_language.length > 0 &&
            this.props.recordToFix.fez_record_search_key_language[0].rek_language
         || 'eng';

        // fez_record_search_key_quality_indicator
        const editQualityIndicator = (
            isDocumentType1 ||
            isDocumentType2 ||
            isDocumentType3
        ) && (
            !this.props.recordToFix ||
            !this.props.recordToFix.fez_record_search_key_quality_indicator ||
            this.props.recordToFix.fez_record_search_key_quality_indicator.length === 0
        );

        // fez_record_search_key_total_pages
        const editExtent = (
            isDocumentType1 ||
            isDocumentType2
        ) && (
            !this.props.recordToFix ||
            !this.props.recordToFix.fez_record_search_key_total_pages ||
            !this.props.recordToFix.fez_record_search_key_total_pages.rek_total_pages
        );


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
                {
                    this.props.publicationToFixFileUploadingError &&
                    <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />
                }
                {saveConfirmationLocale.confirmationMessage}
            </React.Fragment>
        );

        // Does the record have any files attached
        const hasAnyFiles = this.props.recordToFix &&
            this.props.recordToFix.fez_datastream_info &&
            this.props.recordToFix.fez_datastream_info.length || 0
        ;
        console.log(editSignificance);
        return (
            <StandardPage title={txt.title}>
                <PublicationCitation publication={this.props.recordToFix} />
                <form onSubmit={this._handleDefaultSubmit}>
                    <NavigationDialogBox
                        when={this.props.dirty && !this.props.submitSucceeded}
                        txt={txtFixForm.cancelWorkflowConfirmation}
                    />
                    <ConfirmDialogBox
                        onRef={this._setSuccessConfirmation}
                        onCancelAction={this._navigateToMyIncomplete}
                        onAction={this._navigateToDashboard}
                        locale={saveConfirmationLocale}
                    />
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <Alert
                                title={txt.prompt.title}
                                message={txt.prompt.message}
                                type={txt.prompt.type}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={viewRecordLocale.viewRecord.sections.publicationDetails}>
                                <Grid container spacing={8} className={this.props.classes.GridType}>
                                    {
                                        !!this.props.recordToFix && !!this.props.recordToFix.rek_display_type_lookup &&
                                        <Grid container spacing={16} alignItems="flex-start">
                                            <Grid item xs={12} sm={3}>
                                                <Typography variant="body2">{viewRecordLocale.viewRecord.headings.default.publicationDetails.rek_display_type}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={9}>
                                                <Typography variant="body2">{this.props.recordToFix.rek_display_type_lookup}</Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                </Grid>
                                <Grid container spacing={8} className={this.props.classes.GridSubType}>
                                    {
                                        !!this.props.recordToFix && !!this.props.recordToFix.rek_subtype &&
                                        <Grid container spacing={16} alignItems="flex-start">
                                            <Grid item xs={12} sm={3}>
                                                <Typography variant="body2">{viewRecordLocale.viewRecord.headings.default.publicationDetails.rek_subtype}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={9}>
                                                <Typography variant="body2">{this.props.recordToFix.rek_subtype}</Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {
                            isNtro && (
                                editCreatorContributionStatement ||
                                editAbstract ||
                                editExtent ||
                                editAudienceSize ||
                                editSignificance ||
                                editQualityIndicator ||
                                editLanguage
                            ) &&
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
                                    isNtro
                                    locale={txt.fields.authors.field}
                                    name="authorsAffiliation"
                                    required
                                    showContributorAssignment
                                />
                            </StandardCard>
                        </Grid>

                        <Grid item xs={12}>
                            <StandardCard title={txt.fields.notes.title}>
                                <Field
                                    style={{marginTop: -24}}
                                    component={TextField}
                                    name="comments"
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
                                        validate={[validation.fileUploadRequired, validation.validFileUpload]}
                                        isNtro
                                        {...txt.fields.fileUpload}
                                    />
                                </StandardCard>
                            </Grid>
                        }
                        {
                            alertProps &&
                            <Grid item xs={12}>
                                <Alert pushToTop {...alertProps} />
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={24}>
                        <Hidden smDown>
                            <Grid item xs />
                        </Hidden>
                        <Grid item xs={12} md="auto">
                            <Button
                                variant="contained"
                                fullWidth
                                children={txt.cancelButtonLabel}
                                disabled={this.props.submitting}
                                onClick={this._cancelFix} />
                        </Grid>
                        <Grid item xs={12} md="auto">
                            <Button
                                id="update-my-work"
                                variant="contained"
                                color="primary"
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

const MyIncompleteRecord = withStyles(styles, {withTheme: true})(MyIncompleteRecordClass);
export default MyIncompleteRecord;
