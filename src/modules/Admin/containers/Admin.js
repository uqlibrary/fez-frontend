import {connect} from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';
import { updateCommunitySecurity } from 'actions';
import Immutable from 'immutable';
import Admin from '../components/Admin';
import { securityAssignments } from '../components/MockData';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {withRouter} from 'react-router';
import Cookies from 'js-cookie';

const FORM_NAME = 'Prototype';

const onSubmit = (values, dispatch) => {
    return dispatch(updateCommunitySecurity({...values.toJS()}))
        .catch(error => {
            throw new SubmissionError({_error: error});
        });
};

let PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit
})(confirmDiscardFormChanges(Admin, FORM_NAME));

const mapStateToProps = (state) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            communitySecurity: securityAssignments[0].policyID,
            collectionSecurity: 2,
            collection: [],
            subject: []
        },
        tabbed: Cookies.get('adminFormTabbed') && !!(Cookies.get('adminFormTabbed') === 'tabbed')
    };
};

PrototypeContainer = connect(mapStateToProps)(PrototypeContainer);
export default withRouter(PrototypeContainer);
