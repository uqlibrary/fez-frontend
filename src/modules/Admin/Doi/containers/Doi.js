import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import { withRouter } from 'react-router-dom';

import Doi from '../components/Doi';

import * as actions from 'actions';

const FORM_NAME = 'Doi';

export const onSubmit = (values, dispatch, props) => {
    return dispatch(actions.updateDoi({ pid: props.pid })).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

/* istanbul ignore next */
const mapStateToProps = state => {
    const { recordToView: record, loadingRecordToView } = state.get('viewRecordReducer') || {};
    const { author } = state.get('accountReducer') || {};
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    return {
        author,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        formErrors: formErrors,
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        loadingRecordToView,
        record,
    };
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
    const { loadRecordToView, clearRecordToView } = bindActionCreators(actions, dispatch);
    return { loadRecordToView, clearRecordToView };
};

const DoiForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(Doi);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoiForm));
