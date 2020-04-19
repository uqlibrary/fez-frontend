import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import CommunityForm from '../components/CommunityForm';
import { createCommunity, checkSession, clearSessionExpiredFlag } from 'actions';
import { bindActionCreators } from 'redux';

const FORM_NAME = 'Community';

const onSubmit = (values, dispatch, props) => {
    const currentAuthor = props.author || null;
    return dispatch(createCommunity({ ...values.toJS() }, (currentAuthor && currentAuthor.aut_id) || null)).catch(
        error => {
            throw new SubmissionError({ _error: error });
        },
    );
};

const CommunityContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(CommunityForm);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        author: (state && state.get('accountReducer') && state.get('accountReducer').author) || null,
        newRecord:
            (state && state.get('createCommunityReducer') && state.get('createCommunityReducer').newRecord) || null,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ checkSession, clearSessionExpiredFlag }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityContainer);
