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

    // This section is here for interoperability of redux forms and how
    // the admin system was originally built.
    !(data.adminSection || {}).jnl_title && (errors.adminSection.jnl_title = summary.jnl_title);
    !(data.adminSection || {}).jnl_publisher && (errors.adminSection.jnl_publisher = summary.jnl_publisher);

    const adminJournalErrors = validateAdminJournal(data, locale);
    errors = deepmerge(errors, adminJournalErrors);

    errors = Object.entries(errors).reduce(
        (result, [key, value]) => (Object.values(value).length !== 0 && { ...result, [key]: value }) || { ...result },
        {},
    );
    return errors;
};
