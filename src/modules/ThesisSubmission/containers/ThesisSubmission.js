import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import ThesisSubmission from '../components/ThesisSubmission';
import { submitThesis, checkSession, clearSessionExpiredFlag } from 'actions';
import { general } from 'config';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';

import { ReloadReducerFromLocalStorage } from 'modules/SharedComponents/ReloadReducerFromLocalStorage';
import { LocallyStoredReducerContext } from 'context';

const FORM_NAME = 'ThesisSubmission';

const onSubmit = (values, dispatch, props) => {
    return dispatch(submitThesis({ ...values.toJS(), isHdrThesis: props.isHdrThesis }, {}, FORM_NAME)).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

let ThesisSubmissionContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(ThesisSubmission);

const mapStateToProps = (state, props) => {
    //  Get any initial values set during redux store initialisation
    const initialValuesSetInRedux = (!!state.get('form') && (state.get('form').toJS()[FORM_NAME] || {}).values) || {};
    const currentAuthor = state && state.get('accountReducer') ? state.get('accountReducer').author : null;
    const isSessionValid =
        state && state.get('accountReducer') ? state.get('accountReducer').isSessionExpired === false : null;
    const newRecordFileUploadingOrIssueError =
        state && state.get('createRecordReducer')
            ? state.get('createRecordReducer').newRecordFileUploadingOrIssueError
            : false;
    const newRecord = state && state.get('createRecordReducer') ? state.get('createRecordReducer').newRecord : null;
    const fullyUploadedFiles =
        state && state.get('fileUploadReducer') && state.get('fileUploadReducer')[FORM_NAME]
            ? state.get('fileUploadReducer')[FORM_NAME].completedUploads
            : [];
    const isUploadInProgress = state && state.get('fileUpload') && state.get('fileUpload').isUploadInProgress;

    // eslint-disable-next-line no-unused-vars
    const { files, ...locallyStoredValues } =
        !!props.locallyStoredReducer &&
        !!props.locallyStoredReducer.get(FORM_NAME) &&
        props.locallyStoredReducer.get(FORM_NAME).values;

    const today = new Date();
    const initialValues = {
        ...initialValuesSetInRedux,
        rek_date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
        currentAuthor: [
            {
                nameAsPublished: currentAuthor ? currentAuthor.aut_display_name : '',
                authorId: currentAuthor ? currentAuthor.aut_id : '',
            },
        ],
        fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
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
        newRecordFileUploadingOrIssueError,
        newRecord,
        isSessionValid,
        fullyUploadedFiles,
        isUploadInProgress,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ checkSession, clearSessionExpiredFlag, ...actions }, dispatch),
    retryUpload: (values, newRecordData, fullyUploadedFiles) =>
        dispatch(submitThesis({ ...values.toJS() }, newRecordData, FORM_NAME, fullyUploadedFiles))
            .then(() => {
                dispatch({
                    type: 'CREATE_RECORD_SUCCESS',
                    payload: {
                        newRecord: newRecordData,
                        fileUploadOrIssueFailed: false,
                    },
                });
            })
            .catch(() => {}),
});

ThesisSubmissionContainer = connect(mapStateToProps, mapDispatchToProps)(ThesisSubmissionContainer);

const ThesisSubmissionContainerWithReducer = props => (
    <ReloadReducerFromLocalStorage>
        <LocallyStoredReducerContext.Consumer>
            {({ locallyStoredReducer }) => (
                <ThesisSubmissionContainer {...props} locallyStoredReducer={locallyStoredReducer} />
            )}
        </LocallyStoredReducerContext.Consumer>
    </ReloadReducerFromLocalStorage>
);

export default ThesisSubmissionContainerWithReducer;
