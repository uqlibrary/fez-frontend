import {connect} from 'react-redux';
import {reduxForm, getFormValues, SubmissionError, getFormSyncErrors} from 'redux-form/immutable';
import Immutable from 'immutable';
import ThesisSubmission from '../components/ThesisSubmission';
import {submitThesis} from 'actions';
import {general} from 'config';

import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';

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
    const currentAuthor = state && state.get('accountReducer') ? state.get('accountReducer').author : null;
    const today = new Date();
    const initialValues = {
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

    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: initialValues,
        author: currentAuthor,
        isHdrThesis: props.isHdrThesis,
        fileAccessId: props.isHdrThesis ? general.HDR_THESIS_DEFAULT_VALUES.fileAccessId : general.SBS_THESIS_DEFAULT_VALUES.fileAccessId
    };
};

ThesisSubmissionContainer = connect(mapStateToProps)(ThesisSubmissionContainer);

export default ThesisSubmissionContainer;
