import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm, getFormValues, getFormSyncErrors, SubmissionError, stopSubmit} from 'redux-form/immutable';
import Immutable from 'immutable';
import FixRecord from '../components/FixRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const FORM_NAME = 'FixRecord';

const onSubmit = (values, dispatch, props) => {
    const data = {
        ...values.toJS(),
        publication: {...props.recordToFix},
        author: {...props.author}
    };
    return dispatch(data.fixAction === 'unclaim'
        ? actions.unclaimRecord(data)
        : actions.fixRecord(data))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        }).catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};
const validate = (values) => {
    stopSubmit(FORM_NAME, null);
    console.log(values);
};


let FixRecordContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit
})(confirmDiscardFormChanges(FixRecord, FORM_NAME));

const mapStateToProps = (state) => {
    return {
        ...state.get('fixRecordReducer'),
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({}),
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
