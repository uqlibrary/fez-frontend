import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';
import Immutable from 'immutable';
import DeleteRecord from '../components/DeleteRecord';
import * as actions from 'actions';
import { DELETED } from 'config/general';

const FORM_NAME = 'DeleteRecord';

const onSubmit = (values, dispatch) => {
    const formValues = values.toJS();
    if (formValues.publication?.fez_record_search_key_deletion_notes?.rek_deletion_notes?.htmlText) {
        formValues.publication.fez_record_search_key_deletion_notes.rek_deletion_notes =
            formValues.publication?.fez_record_search_key_deletion_notes?.rek_deletion_notes?.htmlText;
    }

    return dispatch(
        formValues.publication.rek_status === DELETED
            ? actions.deleteUpdatePartial({ ...formValues })
            : actions.deleteRecord({ ...formValues }),
    ).catch(error => {
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

export default DeleteRecordContainer;
