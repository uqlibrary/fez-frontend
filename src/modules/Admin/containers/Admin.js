import { connect } from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';
import { updateSecurity } from 'actions';
import Immutable from 'immutable';
import Admin from '../components/Admin';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { withRouter } from 'react-router';
import Cookies from 'js-cookie';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import { createHash } from 'crypto';

const FORM_NAME = 'Prototype';

export const cleanDsiForm = (formValues, dsiFormMap, pid) => {
    const cleanValues = {...formValues};
    (dsiFormMap || []).map(dsi => {
        if(
            !cleanValues.hasOwnProperty(dsi.fieldName) ||
            dsi.dsi_pid !== pid
        ) {
            return;
        }
        const dsiPolicy = cleanValues[dsi.fieldName];
        delete cleanValues[dsi.fieldName];
        delete dsi.fieldName;

        dsiPolicy &&
        cleanValues.fez_datastream_info.push({
            ...dsi,
            dsi_security_policy: dsiPolicy
        });
    });
    return cleanValues;
};

const onSubmit = (values, dispatch, formData) => {
    const { pid, recordType, ...formValues } = values.toJS();
    const cleanedFormValues = cleanDsiForm(formValues, formData.dsiFormMap, pid);
    return dispatch(updateSecurity(pid, recordType, cleanedFormValues))
        .catch(error => {
            throw new SubmissionError({ _error: error });
        });
};

const getDsiFieldName = (dsi) => {
    const dsiHash = createHash('md5').update(`${dsi.dsi_pid}${dsi.dsi_dsid}`).digest('hex');
    return `dsiPolicy_${dsiHash}`;
};

let PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit
})(confirmDiscardFormChanges(Admin, FORM_NAME));

const mapStateToProps = (state, ownProps) => {
    const recordToView = state.get('viewRecordReducer').recordToView;
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    let initialFormValues = null;
    const dsiFormMap = [];
    if (!!recordToView) {
        initialFormValues = {
            initialValues: {
                pid: recordToView.rek_pid,
                recordType: recordToView.rek_object_type_lookup,
                rek_security_policy: recordToView.rek_security_policy,
                rek_datastream_policy: recordToView.rek_datastream_policy,
                collection: [],
                subject: []
            }
        };
        if (recordToView.fez_datastream_info) {
            recordToView.fez_datastream_info = recordToView.fez_datastream_info.map((dsi) => {
                const fieldName = getDsiFieldName(dsi);
                dsiFormMap.push({
                    dsi_pid: dsi.dsi_pid,
                    dsi_dsid: dsi.dsi_dsid,
                    fieldName
                });
                dsi.dsi_security_policy = dsi.dsi_security_policy || 0; // Ignore falsy values
                initialFormValues.initialValues[fieldName] = dsi.dsi_security_policy;
                return {
                    ...dsi,
                    fieldName: fieldName
                };
            });
        }
    }
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        tabbed: Cookies.get('adminFormTabbed') && !!(Cookies.get('adminFormTabbed') === 'tabbed'),
        ...(!!initialFormValues ? initialFormValues : {}),
        ...ownProps,
        ...state.get('viewRecordReducer'),
        dsiFormMap
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

PrototypeContainer = connect(mapStateToProps, mapDispatchToProps)(PrototypeContainer);

export default withRouter(PrototypeContainer);
