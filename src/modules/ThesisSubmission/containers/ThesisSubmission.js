import {connect} from 'react-redux';
import {reduxForm, getFormValues, SubmissionError, getFormSyncErrors} from 'redux-form/immutable';
import Immutable from 'immutable';
import ThesisSubmission from '../components/ThesisSubmission';
import {submitThesis, checkSession, clearSessionExpiredFlag} from 'actions';
import {general} from 'config';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {reloadReducerFromLocalStorage} from 'modules/SharedComponents/ReloadReducerFromLocalStorage';

const FORM_NAME = 'ThesisSubmission';

const onSubmit = (values, dispatch, props) => {
    return dispatch(submitThesis({...values.toJS()}, props.author))
        .then(() => {
            // console.log(record);
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        })
        .catch(error => {
            throw new SubmissionError({_error: error});
        });
};

let ThesisSubmissionContainer = reduxForm({
    form: FORM_NAME,
    onSubmit
})(confirmDiscardFormChanges(ThesisSubmission, FORM_NAME));

const mapStateToProps = (state, props) => {
    //  Get any initial values set during redux store initialisation
    const initialValuesSetInRedux = !!state.get('form') && (state.get('form').toJS()[FORM_NAME] || {}).values || {};
    const currentAuthor = state && state.get('accountReducer') ? state.get('accountReducer').author : null;
    const isSessionValid = state && state.get('accountReducer') ? state.get('accountReducer').isSessionExpired === false : null;
    const newRecordFileUploadingOrIssueError = state && state.get('createRecordReducer') ? state.get('createRecordReducer').newRecordFileUploadingOrIssueError : false;
    const newRecord = state && state.get('createRecordReducer') ? state.get('createRecordReducer').newRecord : null;

    // eslint-disable-next-line no-unused-vars
    const {files, ...locallyStoredValues} = !!props.locallyStoredReducer && !!props.locallyStoredReducer.get(FORM_NAME) && props.locallyStoredReducer.get(FORM_NAME).values;

    const today = new Date();
    const initialValues = {
        ...initialValuesSetInRedux,
        rek_date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
        currentAuthor: [
            {
                nameAsPublished: currentAuthor ? currentAuthor.aut_display_name : '',
                authorId: currentAuthor ? currentAuthor.aut_id : ''
            }
        ],
        fez_record_search_key_org_name: {rek_org_name: 'The University of Queensland'},
        ...props.isHdrThesis ? general.HDR_THESIS_DEFAULT_VALUES : general.SBS_THESIS_DEFAULT_VALUES
    };

    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});

    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: Object.keys(locallyStoredValues).length > 0 && locallyStoredValues || initialValues,
        author: currentAuthor,
        isHdrThesis: props.isHdrThesis,
        fileAccessId: props.isHdrThesis ? general.HDR_THESIS_DEFAULT_VALUES.fileAccessId : general.SBS_THESIS_DEFAULT_VALUES.fileAccessId,
        newRecordFileUploadingOrIssueError,
        newRecord,
        isSessionValid
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({checkSession, clearSessionExpiredFlag, ...actions}, dispatch)
});

ThesisSubmissionContainer = connect(mapStateToProps, mapDispatchToProps)(ThesisSubmissionContainer);
ThesisSubmissionContainer = withRouter(ThesisSubmissionContainer);
export default reloadReducerFromLocalStorage()(ThesisSubmissionContainer);
