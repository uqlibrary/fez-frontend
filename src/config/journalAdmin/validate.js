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

    !(data.bibliographicSection || {}).jnl_title && (errors.bibliographicSection.jnl_title = summary.jnl_title);

    const adminJournalErrors = validateAdminJournal(data, locale);
    errors = deepmerge(errors, adminJournalErrors);

    errors = Object.entries(errors).reduce(
        (result, [key, value]) => (Object.values(value).length !== 0 && { ...result, [key]: value }) || { ...result },
        {},
    );

    return errors;
};
