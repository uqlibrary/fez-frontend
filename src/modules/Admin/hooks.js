import { useSelector } from 'react-redux';
import { getInitialFormValues } from './helpers';
import { RECORD_TYPE_RECORD } from 'config/general';

/*
{
    authorDetails,
    clearRecordToView,
    createMode,
    destroy,
    dirty,
    disableSubmit,
    formErrors,
    formValues,
    handleSubmit,
    isDeleted,
    isJobCreated,
    loadingRecordToView,
    loadRecordToView,
    locked,
    recordToView,
    recordToViewError,
    submitSucceeded,
    submitting,
    unlockRecord,
    params,
    error,
}
    */

export const useRecord = (displayType, subType, createMode) => {
    let initialFormValues = {
        initialValues: {
            bibliographicSection: {
                languages: ['eng'],
            },
        },
    };
    let recordToView = undefined;

    const { authorDetails, author } = useSelector(state => state.get('accountReducer'));
    const {
        recordToView: record,
        isRecordLocked,
        loadingRecordToView,
        isDeleted,
        isJobCreated,
        recordToViewError,
        error,
    } = useSelector(state => state.get('viewRecordReducer'));

    if (!createMode) {
        recordToView = { ...record };
        const recordType = ((recordToView || {}).rek_object_type_lookup || '').toLowerCase();
        initialFormValues =
            (!!recordToView && recordToView.rek_pid && getInitialFormValues(recordToView, recordType)) || {};
    }

    return {
        loadingRecordToView,
        authorDetails: authorDetails ?? /* istanbul ignore next */ null,
        author,
        isDeleted,
        isJobCreated,
        recordToView,
        recordToViewError,
        ...initialFormValues,
        locked: isRecordLocked || false,
        error,
    };
};

export const useRecordToView = (recordToView, createMode, methods) => {
    const { newRecord } = useSelector(state => (createMode ? state.get('createAdminRecordReducer') : undefined));

    if (!createMode) return recordToView;

    const displayType = methods.getValues('rek_display_type');
    const selectedSubType = methods.getValues('adminSection.rek_subtype');

    return {
        rek_pid: (!!newRecord && newRecord.rek_pid) || null,
        rek_display_type: displayType,
        rek_subtype: selectedSubType,
        rek_object_type_lookup: RECORD_TYPE_RECORD,
    };
};
