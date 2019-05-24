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
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';

import { validation, routes } from 'config';
import { default as pagesLocale } from 'locale/pages';
import { default as formsLocale } from 'locale/forms';
import { default as viewRecordLocale } from 'locale/viewRecord';
import { default as alertLocale } from 'locale/publicationForm';

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
        ...propTypes,
        submitSucceeded: PropTypes.bool,
        dirty: PropTypes.bool,
        submitting: PropTypes.bool,
        handleSubmit: PropTypes.func,

        disableSubmit: PropTypes.bool,

        recordToFix: PropTypes.object,
        isNtro: PropTypes.bool,
        ntroFieldProps: PropTypes.object,
        isAuthorLinked: PropTypes.bool,
        hasAnyFiles: PropTypes.bool,

        history: PropTypes.object.isRequired,

        publicationToFixFileUploadingError: PropTypes.bool,
        disableDeleteAllGrants: PropTypes.bool,

        classes: PropTypes.object
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
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

    render() {
        const txt = pagesLocale.pages.incompletePublication;

        const { recordToFix, ntroFieldProps, isNtro, hasAnyFiles } = this.props;

        // if author is not linked to this record, abandon form
        if (!this.props.isAuthorLinked) {
            this.props.history.go(-1);
            return <div />;
        }

        const txtFixForm = formsLocale.forms.fixPublicationForm;
        const authors = txt.fields.authors;

        // console.log(this.props);
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                ...alertLocale,
                progressAlert: txt.progressAlert,
                successAlert: txt.successAlert
            }
        });

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
