import * as actions from 'actions';
import { connect } from 'react-redux';
import { change, getFormSyncErrors, getFormValues, reduxForm } from 'redux-form/immutable';
import Immutable from 'immutable';
import AdminContainer from '../components/AdminContainer';
import { adminInterfaceConfig, validate, valueExtractor } from 'config/admin';
import { viewRecordsConfig } from 'config';
import { isFileValid } from 'config/validation';
import {
    DOCUMENT_TYPES_LOOKUP,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_THESIS,
    RECORD_TYPE_RECORD,
    RECORD_TYPE_COMMUNITY,
    RECORD_TYPE_COLLECTION,
} from 'config/general';
import { bindActionCreators } from 'redux';
import { FORM_NAME } from '../constants';
import { onSubmit } from '../submitHandler';
import { authorsParams, bibliographicParams, identifiersParams } from 'modules/Admin/helpers';
import { withNavigate } from 'helpers/withNavigate';

export const filesParams = record => ({
    isDataset: record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION,
});

const getInitialValues = (record, tab, tabParams = () => {}) => {
    if (!adminInterfaceConfig || typeof adminInterfaceConfig[record.rek_display_type] === 'undefined') {
        return false;
    }
    return (adminInterfaceConfig[record.rek_display_type] || {})
        [tab](tabParams(record))
        ?.map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});
};

const getInitialFormValues = (recordToView, recordType) => {
    const { fez_datastream_info: dataStreams, ...rest } = getInitialValues(recordToView, 'files', filesParams);
    const validDataStreams = (dataStreams || []).filter(isFileValid(viewRecordsConfig, true, true));
    return {
        initialValues: {
            pid: recordToView.rek_pid,
            publication: recordToView,
            rek_requires_attribution: false,
            rek_display_type: recordToView.rek_display_type,
            rek_date: recordToView.rek_date || recordToView.rek_created_date,
            identifiersSection:
                (recordType === RECORD_TYPE_RECORD &&
                    getInitialValues(recordToView, 'identifiers', identifiersParams)) ||
                {},
            securitySection: {
                rek_security_policy: recordToView.rek_security_policy,
                ...(recordType === RECORD_TYPE_COLLECTION || recordType === RECORD_TYPE_COMMUNITY
                    ? {
                          rek_datastream_policy: recordToView.rek_datastream_policy,
                      }
                    : {}),
                ...(recordType === RECORD_TYPE_RECORD
                    ? {
                          rek_security_inherited: recordToView.rek_security_inherited,
                          dataStreams: validDataStreams,
                      }
                    : []),
            },
            bibliographicSection:
                ((recordType === RECORD_TYPE_RECORD ||
                    recordType === RECORD_TYPE_COMMUNITY ||
                    recordType === RECORD_TYPE_COLLECTION) &&
                    getInitialValues(recordToView, 'bibliographic', bibliographicParams)) ||
                {},
            authorsSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'authors', authorsParams)) || {},
            adminSection:
                ((recordType === RECORD_TYPE_RECORD || recordType === RECORD_TYPE_COLLECTION) &&
                    getInitialValues(recordToView, 'admin')) ||
                {},
            ntroSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'ntro')) || {},
            grantInformationSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'grantInformation')) || {},
            filesSection:
                (recordType === RECORD_TYPE_RECORD && { fez_datastream_info: validDataStreams, ...rest }) || {},
            notesSection:
                ((recordType === RECORD_TYPE_RECORD ||
                    recordType === RECORD_TYPE_COMMUNITY ||
                    recordType === RECORD_TYPE_COLLECTION) &&
                    getInitialValues(recordToView, 'notes')) ||
                {},
            reasonSection:
                ((recordType === RECORD_TYPE_COMMUNITY || recordType === RECORD_TYPE_COLLECTION) &&
                    getInitialValues(recordToView, 'reason')) ||
                {},
        },
    };
};

const onChange = (values, dispatch) => {
    if (
        !!values.get('rek_display_type') &&
        values.get('rek_display_type') === PUBLICATION_TYPE_THESIS &&
        !!values.get('adminSection')?.get('rek_subtype') &&
        !values.get('bibliographicSection')?.get('rek_genre_type')
    ) {
        dispatch(
            change(FORM_NAME, 'bibliographicSection.rek_genre_type', values.get('adminSection').get('rek_subtype')),
        );
    }
};

const PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
    onChange,
    validate,
    destroyOnUnmount: false,
})(AdminContainer);

const mapStateToProps = (state, props) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    let initialFormValues = {};
    let recordToView = {};
    let locked = false;

    if (props.createMode) {
        const newRecord = state.get('createAdminRecordReducer') && state.get('createAdminRecordReducer').newRecord;
        const displayType = formValues && formValues.get('rek_display_type');
        const selectedSubType =
            formValues &&
            ((!!formValues.get('adminSection') && formValues.get('adminSection').toJS()) || {}).rek_subtype;

        recordToView = {
            rek_pid: (newRecord && newRecord.rek_pid) || null,
            rek_display_type: displayType,
            rek_subtype: selectedSubType,
            rek_object_type_lookup: RECORD_TYPE_RECORD,
        };
        initialFormValues = {
            initialValues: {
                bibliographicSection: {
                    languages: ['eng'],
                },
            },
        };
    } else {
        recordToView = state.get('viewRecordReducer').recordToView;
        locked = state.get('viewRecordReducer').isRecordLocked;
        const recordType = ((recordToView || {}).rek_object_type_lookup || '').toLowerCase();
        initialFormValues =
            (!!recordToView && recordToView.rek_pid && getInitialFormValues(recordToView, recordType)) || {};
    }

    return {
        formValues,
        formErrors,
        disableSubmit:
            !!recordToView &&
            !!recordToView.rek_display_type &&
            typeof DOCUMENT_TYPES_LOOKUP[recordToView.rek_display_type] !== 'undefined' &&
            formErrors &&
            !(formErrors instanceof Immutable.Map),
        loadingRecordToView: state.get('viewRecordReducer').loadingRecordToView,
        authorDetails: state.get('accountReducer').authorDetails || null,
        author: state.get('accountReducer').author,
        recordToView,
        isDeleted: state.get('viewRecordReducer').isDeleted,
        isJobCreated: state.get('viewRecordReducer').isJobCreated,
        recordToViewError: state.get('viewRecordReducer').recordToViewError,
        ...initialFormValues,
        locked,
        error: state.get('viewRecordReducer').error,
    };
};

function mapDispatchToProps(dispatch) {
    const { loadRecordToView, clearRecordToView, unlockRecord } = bindActionCreators(actions, dispatch);
    return {
        loadRecordToView,
        clearRecordToView,
        unlockRecord,
    };
}

const AdminReduxFormContainer = connect(mapStateToProps, mapDispatchToProps)(PrototypeContainer);

export default withNavigate()(AdminReduxFormContainer);
