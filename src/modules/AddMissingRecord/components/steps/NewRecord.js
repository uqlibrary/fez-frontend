import React from 'react';

import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { PublicationForm } from 'modules/SharedComponents/PublicationForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { useNavigate } from 'react-router';

// forms & custom components
import { pathConfig } from 'config';
import locale from 'locale/pages';
import Grid from '@mui/material/GridLegacy';
import { useDispatch, useSelector } from 'react-redux';
import { clearNewRecord } from '../../../../actions';
import { createConfirmDialogBoxRefAssigner } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox/components/ConfirmDialogBox';

export const NewRecord = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const confirmDialogBoxRef = React.useRef();
    const { author } = useSelector(state => state.get('accountReducer'));
    const { rawSearchQuery } = useSelector(state => state.get('searchRecordsReducer'));
    const { newRecord, newRecordFileUploadingOrIssueError } = useSelector(state => state.get('createRecordReducer'));

    const _recordSaved = () => confirmDialogBoxRef.current.showConfirmation();
    const _restartWorkflow = () => {
        dispatch(clearNewRecord());
        navigate(pathConfig.records.add.find);
    };
    const _navigateToMyResearch = () => {
        dispatch(clearNewRecord());
        navigate(pathConfig.records.mine);
    };
    const _navigateToFixRecord = () => {
        dispatch(clearNewRecord());
        navigate(pathConfig.records.fix(newRecord.rek_pid));
    };

    // wait for author to load before rendering
    if (!author?.aut_id) {
        return <span />;
    }

    const txt = locale.pages.addRecord;
    const initialValues = { rek_title: rawSearchQuery };
    const showAlternateActionButton = !!newRecord?.rek_pid?.match?.(/UQ:.+/) && newRecordFileUploadingOrIssueError;

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
                onRef={createConfirmDialogBoxRefAssigner(confirmDialogBoxRef)}
                onAction={_navigateToMyResearch}
                onCancelAction={_restartWorkflow}
                onAlternateAction={_navigateToFixRecord}
                locale={saveConfirmationLocale}
                showAlternateActionButton={showAlternateActionButton}
            />
            <PublicationForm
                onFormSubmitSuccess={_recordSaved}
                onFormCancel={_restartWorkflow}
                initialValues={initialValues}
            />
        </React.Fragment>
    );
};

export default React.memo(NewRecord);
