import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form/immutable';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {
    ContentIndicatorsField,
    showContentIndicatorsField,
} from 'modules/SharedComponents/Toolbox/ContentIndicatorsField';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { pathConfig, validation } from 'config';
import { default as pagesLocale } from 'locale/pages';
import { default as formsLocale } from 'locale/forms';
import { withNavigate } from 'helpers/withNavigate';

export class FixRecord extends PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        disableSubmit: PropTypes.bool,

        recordToFix: PropTypes.object,
        loadingRecordToFix: PropTypes.bool,

        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,

        navigate: PropTypes.func.isRequired,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,

        publicationToFixFileUploadingError: PropTypes.bool,

        errors: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedRecordAction: '',
        };
    }

    componentDidMount() {
        if (this.props.actions && this.props.match.params && this.props.match.params.pid) {
            this.props.actions.loadRecordToFix(this.props.match.params.pid);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox &&
                this.successConfirmationBox.showConfirmation &&
                this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected recordToFix for a fix
        this.props.actions.clearFixRecord();
    }

    isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
        return (
            // eslint-disable-next-line camelcase
            !!author?.aut_id &&
            !!recordToFix &&
            recordToFix[searchKey] &&
            recordToFix[searchKey].length > 0 &&
            recordToFix[searchKey].filter(authorId => authorId[subkey] === author.aut_id).length > 0
        );
    };

    isAuthorLinked = () => {
        const isAuthorLinked = this.isLoggedInUserLinked(
            this.props.author,
            this.props.recordToFix,
            'fez_record_search_key_author_id',
            'rek_author_id',
        );
        const isContributorLinked = this.isLoggedInUserLinked(
            this.props.author,
            this.props.recordToFix,
            'fez_record_search_key_contributor_id',
            'rek_contributor_id',
        );

        return isAuthorLinked || isContributorLinked;
    };

    _navigateToMyResearch = () => {
        this.props.navigate(pathConfig.records.mine);
    };

    _navigateToDashboard = () => {
        this.props.navigate(pathConfig.dashboard);
    };

    _cancelFix = () => {
        this.props.navigate(-1);
    };

    _actionSelected = (event, value) => {
        this.setState({
            selectedRecordAction: value,
        });
    };

    _setSuccessConfirmation = ref => {
        this.successConfirmationBox = ref;
    };
    /* istanbul ignore next */
    _handleDefaultSubmit = event => {
        event && event.preventDefault();
    };

    render() {
        // if author is not linked to this record, abandon form
        if (!(this.props.accountAuthorLoading || this.props.loadingRecordToFix) && !this.isAuthorLinked()) {
            this.props.navigate(-1);
            return <div />;
        }

        const txt = pagesLocale.pages.fixRecord;
        const txtFixForm = formsLocale.forms.fixPublicationForm;
        const txtUnclaimForm = formsLocale.forms.unclaimPublicationForm;

        if (this.props.accountAuthorLoading || this.props.loadingRecordToFix) {
            return (
                <React.Fragment>
                    <InlineLoader message={txt.loadingMessage} />
                </React.Fragment>
            );
        }

        const fixOptions = txt.actionsOptions.map((item, index) => (
            <MenuItem value={item.action} children={item.title} key={`fix_record_action_${index}`} />
        ));

        // set confirmation message depending on file upload status
        const saveConfirmationLocale = { ...txtFixForm.successWorkflowConfirmation };
        saveConfirmationLocale.confirmationMessage = (
            <React.Fragment>
                {this.props.publicationToFixFileUploadingError && (
                    <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />
                )}
                {saveConfirmationLocale.confirmationMessage}
            </React.Fragment>
        );
        const alertProps = validation.getErrorAlertProps({ ...this.props, alertLocale: txtFixForm });
        return (
            <StandardPage title={txt.title}>
                <ConfirmDiscardFormChanges dirty={this.props.dirty} submitSucceeded={this.props.submitSucceeded}>
                    <form onSubmit={this._handleDefaultSubmit}>
                        <Grid container spacing={3}>
                            <Grid xs={12}>
                                <StandardCard title={txt.subTitle} help={txt.help}>
                                    <PublicationCitation
                                        publication={this.props.recordToFix}
                                        citationStyle={'header'}
                                    />
                                    <Field
                                        component={SelectField}
                                        disabled={this.props.submitting}
                                        name="fixAction"
                                        label={txt.fieldLabels.action}
                                        validate={[validation.required]}
                                        onChange={this._actionSelected}
                                        required
                                        selectFieldId="fix-action"
                                    >
                                        {fixOptions}
                                    </Field>
                                </StandardCard>
                            </Grid>
                            {this.state.selectedRecordAction === 'fix' && (
                                <React.Fragment>
                                    <NavigationDialogBox
                                        when={this.props.dirty && !this.props.submitSucceeded}
                                        txt={txtFixForm.cancelWorkflowConfirmation}
                                    />
                                    <ConfirmDialogBox
                                        onRef={this._setSuccessConfirmation}
                                        onAction={this._navigateToMyResearch}
                                        onCancelAction={this._navigateToDashboard}
                                        locale={saveConfirmationLocale}
                                    />
                                    <Grid xs={12}>
                                        <StandardCard title={txtFixForm.comments.title} help={txtFixForm.comments.help}>
                                            <Grid container spacing={2} padding={0}>
                                                <Grid xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        disabled={this.props.submitting}
                                                        name="comments"
                                                        textFieldId="comments"
                                                        type="text"
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        label={txtFixForm.comments.fieldLabels.comments}
                                                    />
                                                </Grid>
                                                <Grid xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        disabled={this.props.submitting}
                                                        name="rek_link"
                                                        textFieldId="rek_link"
                                                        type="text"
                                                        fullWidth
                                                        label={txtFixForm.comments.fieldLabels.url}
                                                        validate={[validation.url]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </StandardCard>
                                    </Grid>
                                    {showContentIndicatorsField(this.props.recordToFix) && (
                                        <Grid xs={12}>
                                            <StandardCard
                                                title={txtFixForm.contentIndicators.title}
                                                help={txtFixForm.contentIndicators.help}
                                            >
                                                <Grid container spacing={3} padding={0}>
                                                    <Grid xs={12}>
                                                        <Typography>
                                                            {txtFixForm.contentIndicators.description}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid xs={12}>
                                                        <Field
                                                            component={ContentIndicatorsField}
                                                            displayType={this.props.recordToFix.rek_display_type}
                                                            disabled={this.props.submitting}
                                                            id="content-indicators"
                                                            name="contentIndicators"
                                                            label={txtFixForm.contentIndicators.label}
                                                            multiple
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </StandardCard>
                                        </Grid>
                                    )}
                                    <Grid xs={12}>
                                        <StandardCard
                                            title={txtFixForm.fileUpload.title}
                                            help={txtFixForm.fileUpload.help}
                                        >
                                            {txtFixForm.fileUpload.description}
                                            <Field
                                                name="files"
                                                component={FileUploadField}
                                                disabled={this.props.submitting}
                                                requireOpenAccessStatus
                                                validate={[validation.validFileUpload]}
                                            />
                                        </StandardCard>
                                    </Grid>
                                </React.Fragment>
                            )}
                            {this.state.selectedRecordAction === 'unclaim' && (
                                <Grid xs={12}>
                                    <StandardCard title={txtUnclaimForm.title} help={txtUnclaimForm.help}>
                                        <Alert {...txtUnclaimForm.alert} />
                                        {txtUnclaimForm.description}
                                        <ConfirmDialogBox
                                            onRef={this._setSuccessConfirmation}
                                            onAction={this._navigateToMyResearch}
                                            onCancelAction={this._cancelFix}
                                            locale={txtUnclaimForm.successWorkflowConfirmation}
                                        />
                                    </StandardCard>
                                </Grid>
                            )}

                            {alertProps && (
                                <Grid xs={12}>
                                    <Alert pushToTop {...alertProps} />
                                </Grid>
                            )}
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid xs />
                            <Grid>
                                <Button
                                    variant={'contained'}
                                    fullWidth
                                    children={txt.cancel}
                                    disabled={this.props.submitting}
                                    onClick={this._cancelFix}
                                    color={'default'}
                                />
                            </Grid>
                            {this.state.selectedRecordAction && (
                                <Grid>
                                    <Button
                                        variant={'contained'}
                                        color={'primary'}
                                        fullWidth
                                        children={txt.submit}
                                        onClick={this.props.handleSubmit}
                                        disabled={this.props.submitting || this.props.disableSubmit}
                                        id="fixSubmit"
                                        data-testid="fix-submit"
                                        data-analyticsid="fixSubmit"
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </StandardPage>
        );
    }
}

export default withNavigate()(FixRecord);
