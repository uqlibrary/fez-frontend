import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import CollectionForm from '../components/CollectionForm';
import { createCollection, checkSession, clearSessionExpiredFlag } from 'actions';
import { bindActionCreators } from 'redux';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { reloadReducerFromLocalStorage } from 'modules/SharedComponents/ReloadReducerFromLocalStorage';

const FORM_NAME = 'Collection';

const onSubmit = (values, dispatch, props) => {
    const currentAuthor = props.author || null;
    return dispatch(createCollection({ ...values.toJS() }, currentAuthor && currentAuthor.aut_id || null))
        .catch(error => {
            throw new SubmissionError({ _error: error });
        });
};

let CollectionContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(confirmDiscardFormChanges(CollectionForm, FORM_NAME));

const mapStateToProps = (state) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        author: state && state.get('accountReducer') && state.get('accountReducer').author || null,
        newRecord: state && state.get('createCollectionReducer') && state.get('createCollectionReducer').newRecord || null,
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ checkSession, clearSessionExpiredFlag }, dispatch),
});

CollectionContainer = connect(mapStateToProps, mapDispatchToProps)(CollectionContainer);

export default reloadReducerFromLocalStorage()(CollectionContainer);
