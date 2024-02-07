import { connect } from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';

import * as actions from 'actions/viewControlledVocab';
import AdminPanel from './AdminPanel';

const FORM_NAME = 'ControlledVocabAdmin';

const mapStateToProps = (state, props) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    console.log(props);
    return {
        onSubmit: props.onAction(props.parentId ?? null),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: (state && state.get('vocabAdminReducer') && state.get('vocabAdminReducer').vocab) || {},
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: FORM_NAME,
    })(AdminPanel),
);
