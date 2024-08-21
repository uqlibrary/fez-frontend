import React from 'react';
import PropTypes from 'prop-types';

import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { PublicationForm } from 'modules/SharedComponents/PublicationForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { useNavigate } from 'react-router-dom';

// forms & custom components
import { pathConfig } from 'config';
import locale from 'locale/pages';
import Grid from '@mui/material/Grid';

export const NewRecord = ({
    account,
    actions,
    rawSearchQuery = '',
    newRecordFileUploadingOrIssueError,
    author,
    newRecord = {},
}) => {
    const navigate = useNavigate();
    const confirmationBoxRef = React.useRef();

    const setConfirmationRef = React.useCallback(node => {
        confirmationBoxRef.current = node; // TODO: Add check that this worked
    }, []);

    const _recordSaved = () => {
        // show record save successfully confirmation box
        confirmationBoxRef.current.showConfirmation();
    };

    const _restartWorkflow = () => {
        actions.clearNewRecord();
        navigate(pathConfig.records.add.find);
    };

    const _navigateToMyResearch = () => {
        actions.clearNewRecord();
        navigate(pathConfig.records.mine);
    };

    const _navigateToFixRecord = () => {
        actions.clearNewRecord();
        navigate(pathConfig.records.fix(newRecord.rek_pid));
    };

    // wait for author to load before rendering
    // eslint-disable-next-line camelcase
    if (!author?.aut_id) {
        return <span />;
    }

    const txt = locale.pages.addRecord;

    // set initial value only if it's a title (not pubmed/DOI)
    const initialValues = {
        currentAuthor: [
            {
                nameAsPublished: author.aut_display_name ? author.aut_display_name : '',
                // eslint-disable-next-line camelcase
                authorId: author?.aut_id,
            },
        ],
        rek_title: rawSearchQuery || '',
        isHdrStudent:
            !!account &&
            account.class &&
            account.class.indexOf('IS_CURRENT') >= 0 &&
            account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0,
    };

    const isPID = /UQ:(.*)/;
    const showAlternateActionButton =
        newRecord && newRecord.rek_pid && isPID.test(newRecord.rek_pid) && newRecordFileUploadingOrIssueError;

    // set confirmation message depending on file upload status
    const saveConfirmationLocale = { ...txt.successWorkflowConfirmation };
    saveConfirmationLocale.confirmationMessage = (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {newRecordFileUploadingOrIssueError && <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />}
                {saveConfirmationLocale.recordSuccessConfirmationMessage}
            </Grid>
        </Grid>
    );
    return (
        <React.Fragment>
            <ConfirmDialogBox
                onRef={setConfirmationRef}
                onAction={_navigateToMyResearch}
                onCancelAction={_restartWorkflow}
                showAlternateActionButton={showAlternateActionButton}
                onAlternateAction={_navigateToFixRecord}
                locale={saveConfirmationLocale}
            />
            <PublicationForm
                onFormSubmitSuccess={_recordSaved}
                onFormCancel={_restartWorkflow}
                initialValues={initialValues}
            />
        </React.Fragment>
    );
};
NewRecord.propTypes = {
    account: PropTypes.object,
    actions: PropTypes.object.isRequired,
    rawSearchQuery: PropTypes.string,
    newRecordFileUploadingOrIssueError: PropTypes.bool,
    author: PropTypes.object,
    newRecord: PropTypes.object,
};

export default React.memo(NewRecord);
