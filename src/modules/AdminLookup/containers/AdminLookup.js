import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AdminLookup from '../components/AdminLookup';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';
import {getFormSyncErrors, getFormValues} from 'redux-form/immutable';
import Immutable from 'immutable';
const FORM_NAME = 'AdminLookupTool';

const mapStateToProps = (state) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});

    return {
        ...state.get('adminLookupToolReducer'),
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map)
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let AdminLookupContainer = connect(mapStateToProps, mapDispatchToProps)(AdminLookup);
AdminLookupContainer = withRouter(AdminLookupContainer);

export default AdminLookupContainer;
