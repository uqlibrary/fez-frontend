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
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';

import { general, validation, routes } from 'config';
import { default as pagesLocale } from 'locale/pages';
import { default as formsLocale } from 'locale/forms';
import { default as viewRecordLocale } from 'locale/viewRecord';
import { default as alertLocale } from 'locale/publicationForm';

import locale from 'locale/global';

import {
    DOCUMENT_TYPE_BOOK_CHAPTER,
    DOCUMENT_TYPE_JOURNAL_ARTICLE,
    CPEE_NTRO_SUBTYPES,
    LP_NTRO_SUBTYPES,
} from 'config/general';
import {pathConfig} from 'config/routes';

import {withStyles} from '@material-ui/core/styles';
import {viewRecordsConfig} from 'config';

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

    _cancelFix = () => {
        this.props.history.push(pathConfig.records.incomplete);
    };

    _setSuccessConfirmation = (ref) => {
        this.successConfirmationBox = ref;
    };

    _handleDefaultSubmit = (event) => {
        if (event) event.preventDefault();
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

    getCurrentAuthorOrder = (recordToFix, author) => {
        const currentAuthor = recordToFix && recordToFix.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === author.aut_id);
        return currentAuthor.length > 0 && currentAuthor[0].rek_author_id_order;
    };

    getNtroFieldFlags = (recordToFix) => {
        const {author} = this.props;
        const currentAuthorOrder = this.getCurrentAuthorOrder(recordToFix, author);

        return {
            hideAbstract: !!recordToFix.rek_formatted_abstract || !!recordToFix.rek_description,
            hideLanguage: (recordToFix.fez_record_search_key_language || []).length !== 0,
            hidePeerReviewActivity: (recordToFix.fez_record_search_key_quality_indicator || []).length !== 0,
            hideExtent: (
                [ DOCUMENT_TYPE_BOOK_CHAPTER, DOCUMENT_TYPE_JOURNAL_ARTICLE ].includes(recordToFix.rek_display_type_lookup) ||
                !!(recordToFix.fez_record_search_key_total_pages || {}).rek_total_pages
            ),
            hideAudienceSize: (
                ![ ...LP_NTRO_SUBTYPES, ...CPEE_NTRO_SUBTYPES ].includes(recordToFix.rek_subtype) ||
                !!(recordToFix.fez_record_search_key_audience_size || {}).rek_audience_size
            ),
            showSignificance: (
                (recordToFix.fez_record_search_key_significance || []).length === 0 ||
                recordToFix.fez_record_search_key_significance.filter(item => (
                    item.rek_significance_order === currentAuthorOrder &&
                    !item.rek_significance
                )).length > 0
            ),
            showContributionStatement: (
                (recordToFix.fez_record_search_key_creator_contribution_statement || []).length === 0 ||
                recordToFix.fez_record_search_key_creator_contribution_statement.filter(item => (
                    item.rek_creator_contribution_statement_order === currentAuthorOrder &&
                    (
                        !item.rek_creator_contribution_statement ||
                        item.rek_creator_contribution_statement === '' ||
                        item.rek_creator_contribution_statement === locale.global.defaultAuthorDataPlaceholder
                    )
                )).length > 0
            )
        };
    };

    isFileValid = (dataStream) => {
        const {files: {blacklist}} = viewRecordsConfig;
        return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex)
            && (!dataStream.dsi_label || !!dataStream.dsi_label.match(new RegExp(blacklist.descriptionKeywordsRegex, 'gi')))
            && dataStream.dsi_state === 'A';
    };

    render() {
        const txt = pagesLocale.pages.incompletePublication;

        const { accountAuthorLoading, loadingRecordToFix } = this.props;
        // display loading spinner
        if (accountAuthorLoading || loadingRecordToFix) {
            return (
                <React.Fragment>
                    <InlineLoader message={txt.loadingMessage} />
                </React.Fragment>
            );
        }

        // if author is not linked to this record, abandon form
        if (
            !(accountAuthorLoading || loadingRecordToFix) &&
            !this.isAuthorLinked()
        ) {
            // this.props.history.go(-1);
            this.props.history.push(routes.pathConfig.dashboard);
            return <div />;
        }

        const txtFixForm = formsLocale.forms.fixPublicationForm;
        const authors = txt.fields.authors;

        const {recordToFix} = this.props;
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                ...alertLocale,
                progressAlert: txt.progressAlert,
                successAlert: txt.successAlert
            }
        });

        const isNtro = !!recordToFix &&
            !!recordToFix.rek_subtype &&
            !!general.NTRO_SUBTYPES.includes(recordToFix.rek_subtype)
        ;

        const ntroFieldProps = isNtro && this.getNtroFieldFlags(recordToFix);

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
        const hasAnyFiles = recordToFix &&
            recordToFix.fez_datastream_info &&
            recordToFix.fez_datastream_info.length > 0 &&
            recordToFix.fez_datastream_info.map(item => {
                return this.isFileValid(item);
            }).some(item => item === true);
        return (
            <StandardPage title={txt.title} help={txt.help}>
                <PublicationCitation publication={recordToFix} />
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
                                        !!recordToFix && !!recordToFix.rek_display_type_lookup &&
                                        <Grid container spacing={16} alignItems="flex-start">
                                            <Grid item xs={12} sm={3}>
                                                <Typography variant="body2">{viewRecordLocale.viewRecord.headings.default.publicationDetails.rek_display_type}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={9}>
                                                <Typography variant="body2">{recordToFix.rek_display_type_lookup}</Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                </Grid>
                                <Grid container spacing={8} className={this.props.classes.GridSubType}>
                                    {
                                        !!recordToFix && !!recordToFix.rek_subtype &&
                                        <Grid container spacing={16} alignItems="flex-start">
                                            <Grid item xs={12} sm={3}>
                                                <Typography variant="body2">{viewRecordLocale.viewRecord.headings.default.publicationDetails.rek_subtype}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={9}>
                                                <Typography variant="body2">{recordToFix.rek_subtype}</Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {
                            isNtro &&
                            <NtroFields
                                submitting={this.props.submitting}
                                hideIsmn
                                hideIsrc
                                hideVolume
                                hideIssue
                                hideStartPage
                                hideEndPage
                                hideOriginalFormat
                                hideSeries
                                disableDeleteAllGrants={this.props.disableDeleteAllGrants}
                                {...ntroFieldProps}
                            />
                        }
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
