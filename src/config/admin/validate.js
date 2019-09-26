import { locale } from 'locale';
import { PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

export default values => {
    const data = values.toJS();

    const errors = {};
    const bibliographicSectionErrors = {};
    const additionalInformationSectionErrors = {};

    !(data.bibliographicSection || {}).rek_title &&
        (bibliographicSectionErrors.rek_title = locale.validationErrorsSummary.rek_title);

    !(data.bibliographicSection || {}).rek_date &&
        (bibliographicSectionErrors.rek_date = locale.validationErrorsSummary.rek_date);

    !((data.additionalInformationSection || {}).collections || []).length > 0 &&
        (additionalInformationSectionErrors.collections = locale.validationErrorsSummary.collection_pid);

    switch (data.rek_display_type) {
        case PUBLICATION_TYPE_DATA_COLLECTION:
            !(data.additionalInformationSection || {}).contactName &&
                (additionalInformationSectionErrors.contactName = locale.validationErrorsSummary.contactName);
            !(data.additionalInformationSection || {}).contactNameId &&
                (additionalInformationSectionErrors.contactNameId = locale.validationErrorsSummary.contactNameId);
            !(data.additionalInformationSection || {}).contactEmail &&
                (additionalInformationSectionErrors.contactEmail = locale.validationErrorsSummary.contactEmail);
            break;
        default:
            break;
    }

    Object.keys(bibliographicSectionErrors).length && (errors.bibliographicSection = { ...bibliographicSectionErrors });
    Object.keys(additionalInformationSectionErrors).length &&
        (errors.additionalInformationSection = { ...additionalInformationSectionErrors });
    return errors;
};
