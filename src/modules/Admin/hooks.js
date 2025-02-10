import { useSelector } from 'react-redux';
import { getInitialFormValues } from './helpers';
import {
    RECORD_TYPE_RECORD,
    PUBLICATION_TYPE_THESIS,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
} from 'config/general';
import { useWatch } from 'react-hook-form';

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
        recordToView = record;
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
    const [
        rekDisplayType,
        adminSectionRekSubtype,
        bibliographicSectionRekGenreType,
        bibliographicSectionFezMatchedJournals,
        fezJournalIssn,
    ] = useWatch({
        control: form.control,
        name: [
            'rek_display_type',
            'adminSection.rek_subtype',
            'bibliographicSection.rek_genre_type',
            'bibliographicSection.fez_matched_journals',
            'fez_journal_issn',
        ],
    });
    if (rekDisplayType === PUBLICATION_TYPE_THESIS && !!adminSectionRekSubtype && !!!bibliographicSectionRekGenreType) {
        console.log('updating bibliographicSection.rek_genre_type', adminSectionRekSubtype);
        form.setValue('bibliographicSection.rek_genre_type', adminSectionRekSubtype);
    }

    const { isTouched } = form.getFieldState('rek_display_type');

    if (
        bibliographicSectionFezMatchedJournals &&
        fezJournalIssn &&
        isTouched === false &&
        [PUBLICATION_TYPE_CONFERENCE_PAPER, PUBLICATION_TYPE_JOURNAL_ARTICLE].includes(rekDisplayType)
    ) {
        console.log('update issns', bibliographicSectionFezMatchedJournals, fezJournalIssn);
        const issns = fezJournalIssn.map(issn => ({
            rek_value: {
                key: issn.jnl_issn,
                value: {
                    sherpaRomeo: { link: false },
                    ulrichs: { link: false, linkText: '' },
                },
            },
        }));
        form.setValue(
            'bibliographicSection.fez_record_search_key_journal_name.rek_journal_name',
            bibliographicSectionFezMatchedJournals,
        );
        const bibliographicSectionIssns = form.getValues('bibliographicSection.issns') || [];
        const updatedBibliographicSectionIssns = bibliographicSectionIssns.concat(issns);
        form.setValue('bibliographicSection.issns', updatedBibliographicSectionIssns);
    }
};
