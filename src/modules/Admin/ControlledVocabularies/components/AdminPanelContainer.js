import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as actions from 'actions/viewControlledVocab';
import AdminPanel from './AdminPanel';

const mapStateToProps = (state, props) => {
    const formValues = state?.get('vocabAdminReducer')?.vocab || Immutable.Map({});
    const formErrors = {}; // Add validation logic here, if needed
    return {
        onAction: props.onAction(props.parentId ?? null, props.rootVocabId),
        formValues: formValues,
        formErrors: formErrors,
        initialValues: formValues,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
