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
        (additionalInformationSectionErrors.collections = locale.validationErrorsSummary.collections);

    (data.additionalInformationSection || {}).hasOwnProperty('rek_subtype') &&
        !data.additionalInformationSection.rek_subtype &&
        (additionalInformationSectionErrors.rek_subtype = locale.validationErrorsSummary.rek_subtype);

    switch (data.rek_display_type) {
        case PUBLICATION_TYPE_DATA_COLLECTION:
            !data.additionalInformationSection.contactName &&
                (additionalInformationSectionErrors.contactName = locale.validationErrorsSummary.contactName);
            !data.additionalInformationSection.contactNameId &&
                (additionalInformationSectionErrors.contactNameId = locale.validationErrorsSummary.contactNameId);
            !data.additionalInformationSection.contactEmail &&
                (additionalInformationSectionErrors.contactEmail = locale.validationErrorsSummary.contactEmail);
            !(data.additionalInformationSection.fez_record_search_key_project_name || {}).rek_project_name &&
                (additionalInformationSectionErrors.fez_record_search_key_project_name = {
                    rek_project_name: locale.validationErrorsSummary.rek_project_name,
                });
            !(data.additionalInformationSection.fez_record_search_key_project_description || {})
                .rek_project_description &&
                (additionalInformationSectionErrors.fez_record_search_key_project_description = {
                    rek_project_description: locale.validationErrorsSummary.rek_project_description,
                });
            !(data.additionalInformationSection.fez_record_search_key_access_conditions || {}).rek_access_conditions &&
                (additionalInformationSectionErrors.fez_record_search_key_access_conditions = {
                    rek_access_conditions: locale.validationErrorsSummary.rek_access_conditions,
                });
            break;
        default:
            break;
    }

    Object.keys(bibliographicSectionErrors).length && (errors.bibliographicSection = { ...bibliographicSectionErrors });
    Object.keys(additionalInformationSectionErrors).length &&
        (errors.additionalInformationSection = { ...additionalInformationSectionErrors });

    return errors;
};
