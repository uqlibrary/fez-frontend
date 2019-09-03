// import React, { useRef, useEffect } from 'react';
// import PropTypes from 'prop-types';
import * as actions from 'actions';
import { connect } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';
import { adminUpdate } from 'actions';
import Immutable from 'immutable';
import AdminContainer from '../components/AdminContainer';
// import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { withRouter } from 'react-router';
import { adminInterfaceConfig, valueExtractor } from 'config/adminInterface';
import { viewRecordsConfig } from 'config';
import { RECORD_TYPE_COLLECTION, RECORD_TYPE_RECORD } from 'config/general';
// import locale from 'locale/pages';
import { bindActionCreators } from 'redux';

export const FORM_NAME = 'Prototype';

export const getBibliographicInitialValues = record =>
    (adminInterfaceConfig[record.rek_display_type] || {})
        .bibliographic(
            record.fez_record_search_key_language.length > 1 ||
                record.fez_record_search_key_language[0].rek_language !== 'eng',
        )
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});

export const getIdentifiersInitialValues = record =>
    (adminInterfaceConfig[record.rek_display_type] || {})
        .identifiers()
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});

export const getAuthorsInitialValues = record =>
    (adminInterfaceConfig[record.rek_display_type] || {})
        .authors()
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});

export const getAdditionalInformationValues = record =>
    (adminInterfaceConfig[record.rek_display_type] || {})
        .additionalInformation()
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});

export const getNtroValues = record =>
    (adminInterfaceConfig[record.rek_display_type] || {})
        .ntro()
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});

export const getGrantInformationValues = record =>
    (adminInterfaceConfig[record.rek_display_type] || {})
        .grantInformation()
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});

export const getFilesValues = record =>
    (adminInterfaceConfig[record.rek_display_type] || {})
        .files()
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});

export const isFileValid = dataStream => {
    const {
        files: { blacklist },
    } = viewRecordsConfig;

    return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex) && dataStream.dsi_state === 'A';
};

const onSubmit = (values, dispatch) => {
    return dispatch(adminUpdate(values.toJS())).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

const PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(confirmDiscardFormChanges(AdminContainer, FORM_NAME));

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const recordToView = state.get('viewRecordReducer').recordToView;
    const recordType = ((recordToView || {}).rek_object_type_lookup || '').toLowerCase();

    const initialFormValues = !!recordToView
        ? {
            initialValues: {
                pid: recordToView.rek_pid,
                publication: recordToView,
                rek_date: recordToView.rek_date || recordToView.rek_created_date,
                collection: [],
                subject: [],
                adminSection: {
                    rek_herdc_notes: {
                        plainText: (recordToView || {}).rek_herdc_notes,
                        htmlText: (recordToView || {}).rek_herdc_notes,
                    },
                    internalNotes: {
                        plainText: ((recordToView || {}).fez_internal_notes || {}).ain_detail,
                        htmlText: ((recordToView || {}).fez_internal_notes || {}).ain_detail,
                    },
                },
                identifiersSection:
                      (recordType === RECORD_TYPE_RECORD && getIdentifiersInitialValues(recordToView)) || {},
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
                            dataStreams: (recordToView.fez_datastream_info || []).filter(isFileValid),
                        }
                        : {}),
                },
                bibliographicSection:
                      (recordType === RECORD_TYPE_RECORD && getBibliographicInitialValues(recordToView)) || {},
                authorsSection: (recordType === RECORD_TYPE_RECORD && getAuthorsInitialValues(recordToView)) || {},
                additionalInformationSection:
                      (recordType === RECORD_TYPE_RECORD && getAdditionalInformationValues(recordToView)) || {},
                ntroSection: (recordType === RECORD_TYPE_RECORD && getNtroValues(recordToView)) || {},
                grantInformationSection:
                      (recordType === RECORD_TYPE_RECORD && getGrantInformationValues(recordToView)) || {},
                filesSection: (recordType === RECORD_TYPE_RECORD && getFilesValues(recordToView)) || {},
            },
        }
        : null;

    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        ...(!!initialFormValues ? initialFormValues : {}),
        ...state.get('viewRecordReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    const { loadRecordToView, clearRecordToView } = bindActionCreators(actions, dispatch);
    return {
        loadRecordToView,
        clearRecordToView,
    };
}

const AdminReduxFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PrototypeContainer);

// const getReduxFormInitialValues = (recordToView) => {
//     console.log('mapStateToProps', recordToView);
//     const recordType = recordToView.rek_object_type_lookup.toLowerCase();
//     const initialValues = {
//         pid: recordToView.rek_pid,
//         publication: recordToView,
//         rek_date: recordToView.rek_date || recordToView.rek_created_date,
//         collection: [],
//         subject: [],
//         adminSection: {
//             rek_herdc_notes: recordToView.rek_herdc_notes,
//             fez_internal_notes: { ...recordToView.fez_internal_notes },
//         },
//         identifiersSection: (recordType === RECORD_TYPE_RECORD && getIdentifiersInitialValues(recordToView)) || {},
//         securitySection: {
//             rek_security_policy: recordToView.rek_security_policy,
//             ...(recordType === RECORD_TYPE_COLLECTION
//                 ? {
//                     rek_datastream_policy: recordToView.rek_datastream_policy,
//                 }
//                 : {}),
//             ...(recordType === RECORD_TYPE_RECORD
//                 ? {
//                     rek_security_inherited: recordToView.rek_security_inherited,
//                     dataStreams: (recordToView.fez_datastream_info || []).filter(isFileValid),
//                 }
//                 : {}),
//         },
//         bibliographicSection: (recordType === RECORD_TYPE_RECORD &&
// getBibliographicInitialValues(recordToView)) || {},
//         authorsSection: (recordType === RECORD_TYPE_RECORD && getAuthorsInitialValues(recordToView)) || {},
//     };
//     return initialValues;
// };

// export const AdminReduxFormContainer = (props) => {
//     const { recordToView, loadingRecordToView } = useSelector((state) => state.get('viewRecordReducer'));

//     const formErrors = useSelector((state) => getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({}));
//     const dispatch = useDispatch();
//     const disableSubmit = useRef(formErrors && !(formErrors instanceof Immutable.Map));
//     const initialValues = useRef(null);

//     if (!!recordToView && !initialValues.current) {
//         initialValues.current = getReduxFormInitialValues(recordToView);
//     }

//     /* istanbul ignore next */
//     /* Enzyme's shallow render doesn't support useEffect hook yet */
//     useEffect(() => {
//         console.log('useEffect');
//         if (!!props.match.params.pid && !!loadRecordToView) {
//             dispatch(loadRecordToView(props.match.params.pid));
//         }
//     }, []);

//     console.log('loadingRecordToView', loadingRecordToView);
//     if (loadingRecordToView) {
//         return <InlineLoader message={locale.pages.edit.loadingMessage} />;
//     } else if (!recordToView) {
//         return <div className="empty" />;
//     }

//     console.log(initialValues.current);
//     return <PrototypeContainer {...props} disableSubmit={disableSubmit} initialValues={initialValues.current} />;
// };

// AdminReduxFormContainer.propTypes = {
//     match: PropTypes.object,
// };
export default withRouter(AdminReduxFormContainer);
