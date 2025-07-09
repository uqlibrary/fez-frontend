import {
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
