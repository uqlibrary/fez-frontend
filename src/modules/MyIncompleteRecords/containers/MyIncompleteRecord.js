import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import { FORM_NAME } from '../components/MyIncompleteRecordForm';
import MyIncompleteRecordContainer from '../components/MyIncompleteRecordContainer';

const mapStateToProps = (state) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});

    return {
        ...state.get('fixRecordReducer'),
        ...state.get('accountReducer'),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let MyIncompleteRecordConnectedContainer = connect(mapStateToProps, mapDispatchToProps)(MyIncompleteRecordContainer);
MyIncompleteRecordConnectedContainer = withRouter(MyIncompleteRecordConnectedContainer);
export default MyIncompleteRecordConnectedContainer;
