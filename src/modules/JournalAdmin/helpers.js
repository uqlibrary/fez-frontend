import { adminInterfaceConfig, valueExtractor } from 'config/journalAdmin';
import { ADMIN_JOURNAL } from 'config/general';

const getInitialValues = (config, journal, tab, tabParams = () => {}) => {
    return (config[ADMIN_JOURNAL] || /* istanbul ignore next */ {})
        [tab]?.(tabParams(journal))
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(journal),
            };
        }, {});
};

export const getInitialFormValues = (journalToView, config = adminInterfaceConfig) => {
    return {
        initialValues: {
            id: journalToView.jnl_jid,
            journal: journalToView,
            adminSection: getInitialValues(config, journalToView, 'admin'),
            bibliographicSection: getInitialValues(config, journalToView, 'bibliographic'),
            readAndPublishSection: getInitialValues(config, journalToView, 'readAndPublish'),
            uqDataSection: getInitialValues(config, journalToView, 'uqData')?.uqData || {},
            doajSection: getInitialValues(config, journalToView, 'doaj')?.doaj || {},
            listedSection: getInitialValues(config, journalToView, 'listed')?.listed || {},
        },
    };
};
