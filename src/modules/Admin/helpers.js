import { adminInterfaceConfig, valueExtractor } from 'config/admin';
import { viewRecordsConfig } from 'config';
import { isFileValid } from 'config/validation';
import {
    PUBLICATION_TYPE_DATA_COLLECTION,
    RECORD_TYPE_RECORD,
    RECORD_TYPE_COMMUNITY,
    RECORD_TYPE_COLLECTION,
    NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
    NTRO_SUBTYPE_CPEE_FESTIVAL,
    NTRO_SUBTYPE_CPEE_OTHER,
    NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION,
    NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
    NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION,
    NTRO_SUBTYPE_LP_DANCE,
    NTRO_SUBTYPE_LP_INTERARTS,
    NTRO_SUBTYPE_LP_MUSIC,
    NTRO_SUBTYPE_LP_OTHER,
    NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
    NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
    NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
    NTRO_SUBTYPE_RRW_INTERARTS,
    NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
    NTRO_SUBTYPE_RRW_OTHER,
    NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
    PUBLICATION_TYPE_CREATIVE_WORK,
    PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
    PUBLICATION_TYPE_DIGILIB_IMAGE,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_JOURNAL,
    PUBLICATION_TYPE_REFERENCE_ENTRY,
    PUBLICATION_TYPE_RESEARCH_REPORT,
    PUBLICATION_TYPE_SEMINAR_PAPER,
    AUTHOR_AFFILIATIONS_ALLOWED_TYPES,
} from 'config/general';

export const identifiersParams = record => ({
    displayAll: [
        PUBLICATION_TYPE_BOOK_CHAPTER,
        PUBLICATION_TYPE_BOOK,
        PUBLICATION_TYPE_CONFERENCE_PAPER,
        PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
        PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
        PUBLICATION_TYPE_JOURNAL_ARTICLE,
        PUBLICATION_TYPE_JOURNAL,
        PUBLICATION_TYPE_REFERENCE_ENTRY,
        PUBLICATION_TYPE_RESEARCH_REPORT,
    ].includes(record.rek_display_type),
    displayLocation: [PUBLICATION_TYPE_DIGILIB_IMAGE, PUBLICATION_TYPE_SEMINAR_PAPER].includes(record.rek_display_type),
    displayIdentifiers: PUBLICATION_TYPE_AUDIO_DOCUMENT === record.rek_display_type,
    // hide pubmed fields from PUBLICATION_TYPE_RESEARCH_REPORT
    displayPubmed: [
        PUBLICATION_TYPE_BOOK_CHAPTER,
        PUBLICATION_TYPE_BOOK,
        PUBLICATION_TYPE_CONFERENCE_PAPER,
        PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
        PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
        PUBLICATION_TYPE_JOURNAL_ARTICLE,
        PUBLICATION_TYPE_JOURNAL,
        PUBLICATION_TYPE_REFERENCE_ENTRY,
    ].includes(record.rek_display_type),
    displayPubmedCentral: [PUBLICATION_TYPE_JOURNAL_ARTICLE, PUBLICATION_TYPE_CONFERENCE_PAPER].includes(
        record.rek_display_type,
    ),
    displayIsmn: record.rek_subtype === NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION,
    displayIsrc:
        record.rek_display_type === PUBLICATION_TYPE_CREATIVE_WORK &&
        [
            NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
            NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
            NTRO_SUBTYPE_RRW_INTERARTS,
            NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
            NTRO_SUBTYPE_RRW_OTHER,
            NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
        ].includes(record.rek_subtype),
});

export const shouldHandleAuthorAffiliations = record =>
    AUTHOR_AFFILIATIONS_ALLOWED_TYPES?.[record.rek_display_type]?.includes(record.rek_subtype) ?? false;

export const bibliographicParams = (record, formValues) => ({
    isLote:
        (record.fez_record_search_key_language &&
            (record.fez_record_search_key_language.length > 1 ||
                (record.fez_record_search_key_language.length === 1 &&
                    record.fez_record_search_key_language[0].rek_language !== 'eng'))) ||
        (!!formValues &&
            !!formValues.languages &&
            (formValues.languages.length > 1 ||
                (formValues.languages.length === 1 && formValues.languages[0] !== 'eng'))),
    displayEndDate: [
        NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
        NTRO_SUBTYPE_CPEE_FESTIVAL,
        NTRO_SUBTYPE_CPEE_OTHER,
        NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION,
        NTRO_SUBTYPE_LP_DANCE,
        NTRO_SUBTYPE_LP_INTERARTS,
        NTRO_SUBTYPE_LP_MUSIC,
        NTRO_SUBTYPE_LP_OTHER,
        NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
    ].includes(record.rek_subtype),
    isDesignNtro: record.rek_subtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
});

export const authorsParams = (record, isNtro) => {
    const shouldHandleAffiliations = !isNtro && shouldHandleAuthorAffiliations(record);
    return {
        isNtro: isNtro,
        isDesignNtro: record.rek_subtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
        shouldHandleAffiliations,
    };
};

export const filesParams = record => ({
    isDataset: record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION,
});

const getInitialValues = (record, tab, tabParams = () => {}) => {
    /* istanbul ignore next */
    if (!adminInterfaceConfig || typeof adminInterfaceConfig[record.rek_display_type] === 'undefined') {
        return false;
    }
    return (adminInterfaceConfig[record.rek_display_type] || /* istanbul ignore next */ {})
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

export const getInitialFormValues = (recordToView, recordType) => {
    const _recordToView = { ...recordToView };
    const { fez_datastream_info: dataStreams, ...rest } = getInitialValues(_recordToView, 'files', filesParams);
    const validDataStreams = (dataStreams || /* istanbul ignore next */ []).filter(
        isFileValid(viewRecordsConfig, true, true),
    );
    return {
        initialValues: {
            pid: _recordToView.rek_pid,
            publication: _recordToView,
            rek_requires_attribution: false,
            rek_display_type: _recordToView.rek_display_type,
            rek_date: _recordToView.rek_date || _recordToView.rek_created_date,
            identifiersSection:
                (recordType === RECORD_TYPE_RECORD &&
                    getInitialValues(_recordToView, 'identifiers', identifiersParams)) ||
                {},
            securitySection: {
                rek_security_policy: _recordToView.rek_security_policy,
                ...(recordType === RECORD_TYPE_COLLECTION || recordType === RECORD_TYPE_COMMUNITY
                    ? {
                          rek_datastream_policy: _recordToView.rek_datastream_policy,
                      }
                    : {}),
                ...(recordType === RECORD_TYPE_RECORD
                    ? {
                          rek_security_inherited: _recordToView.rek_security_inherited,
                          dataStreams: validDataStreams,
                      }
                    : []),
            },
            bibliographicSection:
                ((recordType === RECORD_TYPE_RECORD ||
                    recordType === RECORD_TYPE_COMMUNITY ||
                    recordType === RECORD_TYPE_COLLECTION) &&
                    getInitialValues(_recordToView, 'bibliographic', bibliographicParams)) ||
                /* istanbul ignore next */ {},
            authorsSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(_recordToView, 'authors', authorsParams)) || {},
            adminSection:
                ((recordType === RECORD_TYPE_RECORD || recordType === RECORD_TYPE_COLLECTION) &&
                    getInitialValues(_recordToView, 'admin')) ||
                {},
            ntroSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(_recordToView, 'ntro')) || {},
            grantInformationSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(_recordToView, 'grantInformation')) || {},
            filesSection:
                (recordType === RECORD_TYPE_RECORD && { fez_datastream_info: validDataStreams, ...rest }) || {},
            notesSection:
                ((recordType === RECORD_TYPE_RECORD ||
                    recordType === RECORD_TYPE_COMMUNITY ||
                    recordType === RECORD_TYPE_COLLECTION) &&
                    getInitialValues(_recordToView, 'notes')) ||
                /* istanbul ignore next */ {},
            reasonSection:
                ((recordType === RECORD_TYPE_COMMUNITY || recordType === RECORD_TYPE_COLLECTION) &&
                    getInitialValues(_recordToView, 'reason')) ||
                {},
        },
    };
};
