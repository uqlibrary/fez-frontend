import { connect } from 'react-redux';
import { reduxForm, /* getFormValues, */ getFormSyncErrors, SubmissionError } from 'redux-form/immutable';
import { adminUpdate } from 'actions';
import Immutable from 'immutable';
import AdminContainer from '../components/AdminContainer';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import { viewRecordsConfig } from 'config';
import { RECORD_TYPE_COLLECTION, RECORD_TYPE_RECORD } from 'config/general';

export const FORM_NAME = 'Prototype';

export const isFileValid = (dataStream) => {
    const { files: { blacklist } } = viewRecordsConfig;

    return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex) &&
        dataStream.dsi_state === 'A';
};

const onSubmit = (values, dispatch) => {
    return dispatch(adminUpdate(values.toJS()))
        .catch(error => {
            throw new SubmissionError({ _error: error });
        });
};

let PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(confirmDiscardFormChanges(AdminContainer, FORM_NAME));

const mapStateToProps = (state) => {
    const recordToView = state.get('viewRecordReducer').recordToView;
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    let initialFormValues = null;
    if (!!recordToView) {
        const recordType = recordToView.rek_object_type_lookup.toLowerCase();
        initialFormValues = {
            initialValues: {
                pid: recordToView.rek_pid,
                publication: recordToView,
                rek_date: recordToView.rek_date || recordToView.rek_created_date,
                collection: [],
                subject: [],
                securitySection: {
                    rek_security_policy: recordToView.rek_security_policy,
                    ...(
                        recordType === RECORD_TYPE_COLLECTION
                            ? { rek_datastream_policy: recordToView.rek_datastream_policy }
                            : {}
                    ),
                    ...(
                        recordType === RECORD_TYPE_RECORD
                            ? {
                                rek_security_inherited: recordToView.rek_security_inherited,
                                dataStreams: recordToView.fez_datastream_info.filter(isFileValid),
                            }
                            : {}
                    ),
                },
            },
        };
    }
    return {
        // formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        // formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        ...(!!initialFormValues ? initialFormValues : {}),
        // ...ownProps,
        ...state.get('viewRecordReducer'),
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
});

PrototypeContainer = connect(mapStateToProps, mapDispatchToProps)(PrototypeContainer);

export default withRouter(PrototypeContainer);
