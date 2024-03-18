import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { PublicationForm } from 'modules/SharedComponents/PublicationForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

// forms & custom components
import { pathConfig } from 'config';
import locale from 'locale/pages';
import Grid from '@mui/material/Grid';

export default class NewRecord extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        actions: PropTypes.object.isRequired,
        navigate: PropTypes.func.isRequired,
        rawSearchQuery: PropTypes.string,
        newRecordFileUploadingOrIssueError: PropTypes.bool,
        author: PropTypes.object,
        newRecord: PropTypes.object,
    };

    static defaultProps = {
        rawSearchQuery: '',
        newRecord: {},
    };

    _recordSaved = () => {
        // show record save successfully confirmation box
        this.confirmationBox.showConfirmation();
    };

    _restartWorkflow = () => {
        this.props.actions.clearNewRecord();
        this.props.navigate(pathConfig.records.add.find);
    };

    _navigateToMyResearch = () => {
        this.props.actions.clearNewRecord();
        this.props.navigate(pathConfig.records.mine);
    };

    _navigateToFixRecord = () => {
        this.props.actions.clearNewRecord();
        this.props.navigate(pathConfig.records.fix(this.props.newRecord.rek_pid));
    };

    render() {
        // wait for author to load before rendering
        // eslint-disable-next-line camelcase
        if (!this.props.author?.aut_id) {
            return <span />;
        }

        const txt = locale.pages.addRecord;
        const { rawSearchQuery } = this.props;

        // set initial value only if it's a title (not pubmed/DOI)
        const initialValues = {
            currentAuthor: [
                {
                    nameAsPublished: this.props.author.aut_display_name ? this.props.author.aut_display_name : '',
                    // eslint-disable-next-line camelcase
                    authorId: this.props.author?.aut_id,
                },
            ],
            rek_title: rawSearchQuery || '',
            isHdrStudent:
                !!this.props.account &&
                this.props.account.class &&
                this.props.account.class.indexOf('IS_CURRENT') >= 0 &&
                this.props.account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0,
        };

        const isPID = /UQ:(.*)/;
        const showAlternateActionButton =
            this.props.newRecord &&
            this.props.newRecord.rek_pid &&
            isPID.test(this.props.newRecord.rek_pid) &&
            this.props.newRecordFileUploadingOrIssueError;

        // set confirmation message depending on file upload status
        const saveConfirmationLocale = { ...txt.successWorkflowConfirmation };
        saveConfirmationLocale.confirmationMessage = (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {this.props.newRecordFileUploadingOrIssueError && (
                        <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />
                    )}
                    {saveConfirmationLocale.recordSuccessConfirmationMessage}
                </Grid>
            </Grid>
        );
        return (
            <React.Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._navigateToMyResearch}
                    onCancelAction={this._restartWorkflow}
                    showAlternateActionButton={showAlternateActionButton}
                    onAlternateAction={this._navigateToFixRecord}
                    locale={saveConfirmationLocale}
                />
                <PublicationForm
                    onFormSubmitSuccess={this._recordSaved}
                    onFormCancel={this._restartWorkflow}
                    initialValues={initialValues}
                />
            </React.Fragment>
        );
    }
}
