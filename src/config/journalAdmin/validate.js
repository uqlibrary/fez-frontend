import { locale } from 'locale';

import { validateAdminJournal } from './fields';

import deepmerge from 'deepmerge';

export default values => {
    const data = values.toJS();
    const summary = locale.validationErrorsSummary;
    let errors = {
        bibliographicSection: {},
        adminSection: {},
    };

    // This section is here for interoperability of redux forms an dhow
    // the admin system was originally built.
    // Note that at the time of writing, Journal admin *does not* require
    // any form of validation.
    // Additionally, the jnl_title check below is included as a sanity check
    // to ensure the journal being saved has a title in the data but again, not required.
    !(data.adminSection || {}).jnl_title && (errors.adminSection.jnl_title = summary.jnl_title);

    const adminJournalErrors = validateAdminJournal(data, locale);
    errors = deepmerge(errors, adminJournalErrors);

    errors = Object.entries(errors).reduce(
        (result, [key, value]) => (Object.values(value).length !== 0 && { ...result, [key]: value }) || { ...result },
        {},
    );

    return errors;
};
