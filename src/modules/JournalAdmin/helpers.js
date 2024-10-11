import { adminInterfaceConfig, valueExtractor } from 'config/journalAdmin';
import { ADMIN_JOURNAL } from 'config/general';

export const getInitialValues = (journal, tab, tabParams = () => {}) => {
    return (adminInterfaceConfig[ADMIN_JOURNAL] || {})
        [tab](tabParams(journal))
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(journal),
            };
        }, {});
};

export const getInitialFormValues = journalToView => {
    return {
        initialValues: {
            id: journalToView.jnl_jid,
            journal: journalToView,
            adminSection: getInitialValues(journalToView, 'admin'),
            bibliographicSection: getInitialValues(journalToView, 'bibliographic'),
            uqDataSection: getInitialValues(journalToView, 'uqData')?.uqData || {},
            doajSection: getInitialValues(journalToView, 'doaj')?.doaj || {},
            indexedSection: getInitialValues(journalToView, 'indexed')?.indexed || {},
        },
    };
};
