import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';
import Immutable from 'immutable';
import DeleteRecord from '../components/DeleteRecord';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
const FORM_NAME = 'DeleteRecord';

const onSubmit = (values, dispatch) => {
    return dispatch(actions.deleteRecord({ ...values.toJS() })).catch(error => {
        throw new SubmissionError({ _error: JSON.stringify(error) });
    });
};

let DeleteRecordContainer = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    onSubmit,
})(DeleteRecord);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const recordToDelete = state.get('deleteRecordReducer') && state.get('deleteRecordReducer').recordToDelete;

    return {
        ...state.get('deleteRecordReducer'),
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            publication: recordToDelete,
        },
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

DeleteRecordContainer = connect(mapStateToProps, mapDispatchToProps)(DeleteRecordContainer);
DeleteRecordContainer = withRouter(DeleteRecordContainer);

export default DeleteRecordContainer;
