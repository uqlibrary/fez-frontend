import {connect} from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors } from 'redux-form/immutable';
import { updateCommunitySecurity } from 'actions/records';
import Immutable from 'immutable';
import Admin from '../components/Admin';
import { securityAssignments } from '../components/MockData';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {withRouter} from 'react-router';
import Cookies from 'js-cookie';
import {bindActionCreators} from 'redux';

const FORM_NAME = 'Prototype';

let PrototypeContainer = reduxForm({
    form: FORM_NAME
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

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ updateCommunitySecurity }, dispatch)
});

PrototypeContainer = connect(mapStateToProps, mapDispatchToProps)(PrototypeContainer);
export default withRouter(PrototypeContainer);
