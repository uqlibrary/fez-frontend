import {connect} from 'react-redux';
import {reduxForm, getFormValues, getFormSyncErrors, SubmissionError} from 'redux-form/immutable';
import {updateSecurity} from 'actions';
import Immutable from 'immutable';
import Admin from '../components/Admin';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {withRouter} from 'react-router';
import Cookies from 'js-cookie';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';

const FORM_NAME = 'Prototype';

const onSubmit = (values, dispatch) => {
    const {pid, recordType, ...formValues} = values.toJS();
    return dispatch(updateSecurity(pid, recordType, formValues))
        .catch(error => {
            throw new SubmissionError({_error: error});
        });
};

let PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit
})(confirmDiscardFormChanges(Admin, FORM_NAME));

const mapStateToProps = (state, ownProps) => {
    const recordToView = state.get('viewRecordReducer').recordToView;
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    let initialFormValues = null;
    if (!!recordToView) {
        initialFormValues = {
            initialValues: {
                pid: recordToView.rek_pid,
                recordType: recordToView.rek_object_type_lookup,
                securityPolicy: recordToView.rek_security_policy,
                datastreamSecurityPolicy: recordToView.rek_datastream_policy,
                collection: [],
                subject: []
            }
        };
    }
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        tabbed: Cookies.get('adminFormTabbed') && !!(Cookies.get('adminFormTabbed') === 'tabbed'),
        ...(!!initialFormValues ? initialFormValues : {}),
        ...ownProps,
        ...state.get('viewRecordReducer'),
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

PrototypeContainer = connect(mapStateToProps, mapDispatchToProps)(PrototypeContainer);

export default withRouter(PrototypeContainer);
