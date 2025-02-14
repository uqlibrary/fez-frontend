import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { getInitialFormValues } from './helpers';
import {
    RECORD_TYPE_RECORD,
    PUBLICATION_TYPE_THESIS,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
} from 'config/general';
import { useWatch } from 'react-hook-form';
import { unionBy } from 'lodash';

export const useInitialFormValues = (recordToView, createMode) => {
    const initialFormValues = {
        initialValues: {
            bibliographicSection: {
                languages: ['eng'],
            },
        },
    };

    if (createMode) return initialFormValues;
    const recordType = ((recordToView || {}).rek_object_type_lookup || '').toLowerCase();
    return (!!recordToView && recordToView.rek_pid && getInitialFormValues(recordToView, recordType)) || {};
};
export const useRecord = (displayType, subType, createMode) => {
    const { authorDetails, author } = useSelector(state => state.get('accountReducer'));
    const {
        recordToView,
        isRecordLocked,
        loadingRecordToView,
        isDeleted,
        isJobCreated,
        recordToViewError,
        error,
    } = useSelector(state => state.get('viewRecordReducer'));

    const initialFormValues = useInitialFormValues(recordToView, createMode);

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
    const { newRecord } = useSelector(state => (createMode ? state.get('createAdminRecordReducer') : {}));

    if (!createMode) return recordToView;

    const displayType = methods.getValues('rek_display_type');
    const selectedSubType = methods.getValues('adminSection.rek_subtype');

    return {
        rek_pid: newRecord?.rek_pid ?? null,
        rek_display_type: displayType,
        rek_subtype: selectedSubType,
        rek_object_type_lookup: RECORD_TYPE_RECORD,
    };
};

export const useFormOnChangeHook = form => {
    const prevBibliographicSectionFezMatchedJournals = useRef('');
    const [
        rekDisplayType,
        adminSectionRekSubtype,
        bibliographicSectionRekGenreType,
        bibliographicSectionFezMatchedJournals,
    ] = useWatch({
        control: form.control,
        name: [
            'rek_display_type',
            'adminSection.rek_subtype',
            'bibliographicSection.rek_genre_type',
            'bibliographicSection.fez_matched_journals',
        ],
    });
    if (rekDisplayType === PUBLICATION_TYPE_THESIS && !!adminSectionRekSubtype && !!!bibliographicSectionRekGenreType) {
        console.log('updating bibliographicSection.rek_genre_type', adminSectionRekSubtype);
        form.setValue('bibliographicSection.rek_genre_type', adminSectionRekSubtype);
    }

    const { isTouched } = form.getFieldState('bibliographicSection.fez_matched_journals');

    if (
        bibliographicSectionFezMatchedJournals &&
        bibliographicSectionFezMatchedJournals.id !== prevBibliographicSectionFezMatchedJournals.current &&
        isTouched === false &&
        [PUBLICATION_TYPE_CONFERENCE_PAPER, PUBLICATION_TYPE_JOURNAL_ARTICLE].includes(rekDisplayType)
    ) {
        prevBibliographicSectionFezMatchedJournals.current = bibliographicSectionFezMatchedJournals.id;
        const issns =
            bibliographicSectionFezMatchedJournals?.fez_journal_issn?.map(issn => ({
                rek_value: {
                    key: issn.jnl_issn,
                    value: {
                        sherpaRomeo: { link: false },
                        ulrichs: { link: false, linkText: '' },
                    },
                },
            })) || [];
        form.setValue(
            'bibliographicSection.fez_record_search_key_journal_name.rek_journal_name',
            bibliographicSectionFezMatchedJournals.value,
            { shouldValidate: true, shouldDirty: true },
        );
        const bibliographicSectionIssns = form.getValues('bibliographicSection.issns') || [];
        // create new array, filter out any dupes
        const updatedBibliographicSectionIssns = unionBy(bibliographicSectionIssns, issns, 'rek_value.key');
        form.setValue('bibliographicSection.issns', updatedBibliographicSectionIssns);
    }
};
