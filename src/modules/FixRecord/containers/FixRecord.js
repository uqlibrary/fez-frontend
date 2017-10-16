import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError} from 'redux-form/immutable';
import Immutable from 'immutable';
import FixRecord from '../components/FixRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

// import {internalTitleSearchList} from 'mock/data/records';
// internalTitleSearchList.data[0],
const FORM_NAME = 'FixRecord';

const onSubmit = (values, dispatch) => {
    const data = {...values.toJS()};
    console.log(data);
    return dispatch(actions.unclaimRecord(data))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        }).catch(error => {
            console.log(error);
            throw new SubmissionError({_error: error.message});
        });
};

const validate = () => {
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);
};

let FixRecordContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit
})(FixRecord);

const mapStateToProps = (state) => {
    return {
        ...state.get('fixRecordReducer'),
        ...state.get('accountReducer'),
        authorLoading: state.get('accountReducer').authorLoading,
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: {
            publication: state.get('fixRecordReducer').recordToFix,
            author: state.get('accountReducer').author
        }
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

FixRecordContainer = connect(mapStateToProps, mapDispatchToProps)(FixRecordContainer);
FixRecordContainer = withRouter(FixRecordContainer);

export default FixRecordContainer;
