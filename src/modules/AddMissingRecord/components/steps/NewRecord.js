import React from 'react';
import PropTypes from 'prop-types';

import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { PublicationForm } from 'modules/SharedComponents/PublicationForm';

import { useNavigate } from 'react-router-dom';

// forms & custom components
import { pathConfig } from 'config';
import locale from 'locale/pages';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { clearNewRecord } from '../../../../actions';

export const NewRecord = ({ newRecord = {} }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const confirmationBoxRef = React.useRef();
    const { author, account } = useSelector(state => state.get('accountReducer'));
    const { rawSearchQuery } = useSelector(state => state.get('searchRecordsReducer'));

    const setConfirmationRef = React.useCallback(node => {
        confirmationBoxRef.current = node; // TODO: Add check that this worked
    }, []);

    const _recordSaved = () => {
        // show record save successfully confirmation box
        confirmationBoxRef.current.showConfirmation();
    };

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

    // set confirmation message depending on file upload status
    const saveConfirmationLocale = { ...txt.successWorkflowConfirmation };
    saveConfirmationLocale.confirmationMessage = (
        <Grid container spacing={3}>
            <Grid item xs={12}>
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
    newRecord: PropTypes.object,
};

export default React.memo(NewRecord);
