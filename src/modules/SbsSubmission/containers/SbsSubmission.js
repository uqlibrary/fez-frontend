import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import SbsSubmission from '../components/SbsSubmission';
import { submitThesis, checkSession, clearSessionExpiredFlag } from 'actions';
import { general } from 'config';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import moment from 'moment';

import { ReloadReducerFromLocalStorage } from 'modules/SharedComponents/ReloadReducerFromLocalStorage';
import { LocallyStoredReducerContext } from 'context';

const FORM_NAME = 'SbsSubmission';

const onSubmit = (values, dispatch) => {
    return dispatch(submitThesis({ ...values.toJS() })).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

let SbsSubmissionContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(SbsSubmission);

const mapStateToProps = (state, props) => {
    const currentAuthor = state && state.get('accountReducer') ? state.get('accountReducer').author : null;
    const isSessionValid =
        state && state.get('accountReducer') ? state.get('accountReducer').isSessionExpired === false : null;
    const newRecordFileUploadingOrIssueError =
        state && state.get('createRecordReducer')
            ? state.get('createRecordReducer').newRecordFileUploadingOrIssueError
            : false;
    const newRecord = state && state.get('createRecordReducer') ? state.get('createRecordReducer').newRecord : null;

    // eslint-disable-next-line no-unused-vars
    const { files, ...locallyStoredValues } =
        !!props.locallyStoredReducer &&
        !!props.locallyStoredReducer.get(FORM_NAME) &&
        props.locallyStoredReducer.get(FORM_NAME).values;

    const today = new Date();
    const initialValues = {
        rek_date: moment(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`),
        currentAuthor: [
            {
                nameAsPublished: currentAuthor ? currentAuthor.aut_display_name : '',
                authorId: currentAuthor ? currentAuthor.aut_id : '',
            },
        ],
        ...(props.isHdrThesis ? general.HDR_THESIS_DEFAULT_VALUES : general.SBS_THESIS_DEFAULT_VALUES),
    };

    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});

    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: (Object.keys(locallyStoredValues).length > 0 && locallyStoredValues) || initialValues,
        author: currentAuthor,
        isHdrThesis: props.isHdrThesis,
        fileAccessId: props.isHdrThesis
            ? general.HDR_THESIS_DEFAULT_VALUES.fileAccessId
            : general.SBS_THESIS_DEFAULT_VALUES.fileAccessId,
        isSessionValid,
        newRecordFileUploadingOrIssueError,
        newRecord,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ checkSession, clearSessionExpiredFlag, ...actions }, dispatch),
});

SbsSubmissionContainer = connect(mapStateToProps, mapDispatchToProps)(SbsSubmissionContainer);

const SbsSubmissionContainerWithReducer = () => (
    <ReloadReducerFromLocalStorage>
        <LocallyStoredReducerContext.Consumer>
            {({ locallyStoredReducer }) => <SbsSubmissionContainer locallyStoredReducer={locallyStoredReducer} />}
        </LocallyStoredReducerContext.Consumer>
    </ReloadReducerFromLocalStorage>
);

export default SbsSubmissionContainerWithReducer;
