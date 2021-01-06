import * as actions from 'actions';
import { connect } from 'react-redux';
import { destroy, reduxForm, getFormValues, getFormSyncErrors, change } from 'redux-form/immutable';
import Immutable from 'immutable';
import AdminContainer from '../components/AdminContainer';
import { withRouter } from 'react-router';
import { adminInterfaceConfig, valueExtractor, validate } from 'config/admin';
import { viewRecordsConfig } from 'config';
import { isFileValid } from 'config/validation';
import {
    DOCUMENT_TYPES_LOOKUP,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_THESIS,
    RECORD_TYPE_COLLECTION,
    RECORD_TYPE_RECORD,
} from 'config/general';
import { bindActionCreators } from 'redux';
import { FORM_NAME } from '../constants';
import { onSubmit } from '../submitHandler';
import { identifiersParams, bibliographicParams, authorsParams } from 'modules/Admin/helpers';

export const filesParams = record => ({
    isDataset: record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION,
});

const getInitialValues = (record, tab, tabParams = () => {}) => {
    // collections and communities dont have this setup
    if (typeof adminInterfaceConfig[record.rek_display_type] === 'undefined') {
        return false;
    }
    return (adminInterfaceConfig[record.rek_display_type] || {})
        [tab](tabParams(record))
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
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
            rek_display_type: recordToView.rek_display_type,
            rek_date: recordToView.rek_date || recordToView.rek_created_date,
            identifiersSection:
                (recordType === RECORD_TYPE_RECORD &&
                    getInitialValues(recordToView, 'identifiers', identifiersParams)) ||
                {},
            securitySection: {
                rek_security_policy: recordToView.rek_security_policy,
                ...(recordType === RECORD_TYPE_COLLECTION
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
                (recordType === RECORD_TYPE_RECORD &&
                    getInitialValues(recordToView, 'bibliographic', bibliographicParams)) ||
                {},
            authorsSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'authors', authorsParams)) || {},
            adminSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'admin')) || {},
            ntroSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'ntro')) || {},
            grantInformationSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'grantInformation')) || {},
            filesSection:
                (recordType === RECORD_TYPE_RECORD && { fez_datastream_info: validDataStreams, ...rest }) || {},
            notesSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'notes')) || {},
        },
    };
};

const onChange = (values, dispatch, props, previousValues) => {
    if (
        !!values.get('rek_display_type') &&
        values.get('rek_display_type') === PUBLICATION_TYPE_THESIS &&
        !!values.get('adminSection').get('rek_subtype') &&
        !values.get('bibliographicSection').get('rek_genre_type')
    ) {
        dispatch(
            change(FORM_NAME, 'bibliographicSection.rek_genre_type', values.get('adminSection').get('rek_subtype')),
        );
    }

    if (
        !!values.get('rek_display_type') &&
        [PUBLICATION_TYPE_CONFERENCE_PAPER, PUBLICATION_TYPE_JOURNAL_ARTICLE].includes(
            values.get('rek_display_type'),
        ) &&
        values.get('bibliographicSection') &&
        values.get('bibliographicSection').get('fez_matched_journals') &&
        values.get('bibliographicSection').get('fez_matched_journals').jnl_title &&
        (!previousValues.get('bibliographicSection') ||
            !previousValues.get('bibliographicSection').get('fez_matched_journals') ||
            !previousValues.get('bibliographicSection').get('fez_matched_journals').jnl_title ||
            previousValues.get('bibliographicSection').get('fez_matched_journals').jnl_title !==
                values.get('bibliographicSection').get('fez_matched_journals').jnl_title)
    ) {
        dispatch(
            change(
                FORM_NAME,
                'bibliographicSection.fez_record_search_key_journal_name.rek_journal_name',
                values.get('bibliographicSection').get('fez_matched_journals').jnl_title,
            ),
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
    const newRecord = state.get('createAdminRecordReducer') && state.get('createAdminRecordReducer').newRecord;
    let initialFormValues = {};
    let recordToView = {};
    let locked = false;

    if (props.createMode) {
        const displayType = formValues && formValues.get('rek_display_type');
        const selectedSubType =
            formValues &&
            ((!!formValues.get('adminSection') && formValues.get('adminSection').toJS()) || {}).rek_subtype;
        const recordType = RECORD_TYPE_RECORD;

        recordToView = {
            rek_pid: (newRecord && newRecord.rek_pid) || null,
            rek_display_type: displayType,
            rek_subtype: selectedSubType,
            rek_object_type_lookup: recordType,
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
    };
};

function mapDispatchToProps(dispatch) {
    const { loadRecordToView, clearRecordToView, unlockRecord } = bindActionCreators(actions, dispatch);
    return {
        loadRecordToView,
        clearRecordToView,
        unlockRecord,
        destroy,
    };
}

const AdminReduxFormContainer = connect(mapStateToProps, mapDispatchToProps)(PrototypeContainer);

export default withRouter(AdminReduxFormContainer);
