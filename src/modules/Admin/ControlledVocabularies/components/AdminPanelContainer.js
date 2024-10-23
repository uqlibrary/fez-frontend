import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from 'actions/viewControlledVocab';
import AdminPanel from './AdminPanel';

const mapStateToProps = (state, props) => {
    const formValues = state?.get('vocabAdminReducer')?.vocab || {};
    return {
        onAction: props.onAction(props.parentId ?? null, props.rootVocabId),
        initialValues: formValues,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
