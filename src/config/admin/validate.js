import { locale } from 'locale';
import {
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
} from 'config/general';
import {
    validateAudioDocument,
    validateBook,
    validateBookChapter,
    validateConferencePaper,
    validateConferenceProceedings,
    validateDataCollection,
} from './fields';

import deepmerge from 'deepmerge';

export default values => {
    const data = values.toJS();

    let errors = {
        bibliographicSection: {},
        additionalInformationSection: {},
    };

    !(data.bibliographicSection || {}).rek_title &&
        (errors.bibliographicSection.rek_title = locale.validationErrorsSummary.rek_title);

    !(data.bibliographicSection || {}).rek_date &&
        (errors.bibliographicSection.rek_date = locale.validationErrorsSummary.rek_date);

    !((data.additionalInformationSection || {}).collections || []).length > 0 &&
        (errors.additionalInformationSection.collections = locale.validationErrorsSummary.collections);

    (data.additionalInformationSection || {}).hasOwnProperty('rek_subtype') &&
        !data.additionalInformationSection.rek_subtype &&
        (errors.additionalInformationSection.rek_subtype = locale.validationErrorsSummary.rek_subtype);

    switch (data.rek_display_type) {
        case PUBLICATION_TYPE_AUDIO_DOCUMENT:
            const audioDocumentErrors = validateAudioDocument(data, locale);
            errors = deepmerge(errors, audioDocumentErrors);
            break;
        case PUBLICATION_TYPE_BOOK:
            const bookErrors = validateBook(data, locale);
            errors = deepmerge(errors, bookErrors);
            break;
        case PUBLICATION_TYPE_BOOK_CHAPTER:
            const bookChapterErrors = validateBookChapter(data, locale);
            errors = deepmerge(errors, bookChapterErrors);
            break;
        case PUBLICATION_TYPE_CONFERENCE_PAPER:
            const conferencePaperErrors = validateConferencePaper(data, locale);
            errors = deepmerge(errors, conferencePaperErrors);
            break;
        case PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS:
            const conferenceProceedingsErrors = validateConferenceProceedings(data, locale);
            errors = deepmerge(errors, conferenceProceedingsErrors);
            break;
        case PUBLICATION_TYPE_DATA_COLLECTION:
            const dataCollectionErrors = validateDataCollection(data, locale);
            errors = deepmerge(errors, dataCollectionErrors);
            break;
        default:
            break;
    }

    errors = Object.entries(errors).reduce(
        (result, [key, value]) => (Object.values(value).length !== 0 && { ...result, [key]: value }) || { ...result },
        {},
    );

    return errors;
};
