export const getValueSearchKeyObject = (journal, searchKey) => {
    const returnValue = { ...((journal || {})[searchKey] || {}) };
    return returnValue;
};

export const getValueSearchKeyArray = (journal, searchKey) => {
    const returnValue = [...((journal || {})[searchKey] || [])];
    return returnValue;
};

export const getValueSearchKeyCKEditor = (journal, plainTextSearchKey, htmlTextSearchKey) => {
    let returnValue;
    if (plainTextSearchKey.indexOf('.') >= 0) {
        const [primaryKey, subKey] = plainTextSearchKey.split('.');
        const [primaryHtmlKey, subHtmlKey] = htmlTextSearchKey.split('.');

        returnValue = {
            plainText: ((journal || {})?.[primaryKey] || {})?.[subKey] || '',
            htmlText:
                ((journal || {})?.[primaryHtmlKey] || {})?.[subHtmlKey] ||
                ((journal || {})?.[primaryKey] || {})?.[subKey] ||
                '',
        };
    } else {
        returnValue = {
            plainText: (journal || {})[plainTextSearchKey] || '',
            htmlText: (journal || {})[htmlTextSearchKey] || (journal || {})[plainTextSearchKey] || '',
        };
    }

    if (!returnValue.plainText && !!returnValue.htmlText) {
        const tempDiv = document.createElement('div');

        // Keep line breaks when converting html to text
        tempDiv.innerHTML = returnValue.htmlText.replaceAll(/<(p|br ?\/?)>/g, '\n').replace(/^\n(.*)/, '$1');

        returnValue.plainText = tempDiv.innerText;
    }

    return returnValue;
};

export const getValueFromKey = (journal, key) => {
    const returnValue = journal[key];
    return returnValue;
};

export const getValueFromSubKey = (journal, key) => {
    let returnValue;

    if (key.indexOf('.') >= 0) {
        const [primaryKey, subKey] = key.split('.');
        returnValue = ((journal || {})[primaryKey] || {})[subKey];
    }

    return returnValue;
};

export const getValueSearchKeyValueList = (journal, searchKey) => {
    let returnValue = [];
    if (searchKey.indexOf('.') >= 0) {
        const [primaryKey, subKey] = searchKey.split('.');

        returnValue = (journal[primaryKey] || []).map(item => item[subKey]);
    }

    return returnValue;
};

const toBoolean = value => {
    if (value === 1 || value === '1') return true;
    else if (value === 0 || value === '0') return false;
    else return value;
};

export default {
    jnl_title: {
        getValue: journal => getValueFromKey(journal, 'jnl_title') ?? '',
    },
    abbreviatedTitle: {
        getValue: journal => getValueFromSubKey(journal, 'fez_journal_jcr_scie.jnl_jcr_scie_abbrev_title'),
    },
    jnl_publisher: {
        getValue: journal => getValueFromKey(journal, 'jnl_publisher') ?? '',
    },
    jnl_is_refereed: {
        getValue: journal =>
            toBoolean(
                getValueFromKey(journal, 'jnl_is_refereed') ??
                    getValueSearchKeyArray(journal, 'fez_journal_issn')?.[0]?.fez_ulrichs?.ulr_refereed,
            ),
    },
    jnl_start_year: {
        getValue: journal =>
            getValueFromKey(journal, 'jnl_start_year') ??
            getValueSearchKeyArray(journal, 'fez_journal_issn')?.[0]?.fez_ulrichs?.ulr_start_year ??
            '',
    },
    jnl_frequency: {
        getValue: journal =>
            getValueFromKey(journal, 'jnl_frequency') ??
            getValueSearchKeyArray(journal, 'fez_journal_issn')?.[0]?.fez_ulrichs?.ulr_frequency ??
            '',
    },
    jnl_formats: {
        getValue: journal =>
            getValueFromKey(journal, 'jnl_formats') ??
            getValueSearchKeyArray(journal, 'fez_journal_issn')?.[0]?.fez_ulrichs?.ulr_formats ??
            '',
    },
    jnl_description: {
        getValue: journal =>
            getValueFromKey(journal, 'jnl_description') ??
            getValueSearchKeyArray(journal, 'fez_journal_issn')?.[0]?.fez_ulrichs?.ulr_description ??
            '',
    },
    capped: {
        getValue: journal => getValueFromSubKey(journal, 'fez_journal_read_and_publish.jnl_read_and_publish_is_capped'),
    },
    discounted: {
        getValue: journal =>
            toBoolean(getValueFromSubKey(journal, 'fez_journal_read_and_publish.jnl_read_and_publish_is_discounted')),
    },
    s2o: {
        getValue: journal => getValueFromSubKey(journal, 'fez_journal_read_and_publish.jnl_read_and_publish_is_s2o'),
    },
    readAndPublishPublisher: {
        getValue: journal => getValueFromSubKey(journal, 'fez_journal_read_and_publish.jnl_read_and_publish_publisher'),
    },
    readAndPublishLastUpdated: {
        getValue: journal =>
            getValueFromSubKey(journal, 'fez_journal_read_and_publish.jnl_read_and_publish_source_date'),
    },
    advisoryStatement: {
        getValue: journal => ({
            type: journal?.jnl_advisory_statement_type,
            text: getValueSearchKeyCKEditor(journal, 'jnl_advisory_statement', 'jnl_advisory_statement'),
        }),
    },
    issns: {
        getValue: journal => {
            const returnValue = (journal.fez_journal_issn || []).map(issn => ({
                rek_order: issn.jnl_issn_order,
                rek_value: {
                    key: issn.jnl_issn,
                    value: {
                        fez_sherpa_romeo: issn.fez_sherpa_romeo,
                        fez_ulrichs: issn.fez_ulrichs,
                    },
                    hasPreload: true,
                },
            }));
            return returnValue;
        },
    },
    uqData: {
        getValue: journal => ({
            authors: {
                count: getValueFromKey(journal, 'uq_author_id_count'),
                id: getValueFromKey(journal, 'jnl_jid'),
            },
        }),
    },
    doaj: {
        getValue: journal => ({
            openAccess:
                getValueSearchKeyArray(journal, 'fez_journal_issn')?.[0]?.fez_ulrichs?.ulr_open_access === 1
                    ? true
                    : false,
            ...getValueSearchKeyObject(journal, 'fez_journal_doaj'),
        }),
    },
    indexed: {
        getValue: journal => ({
            esi: getValueSearchKeyArray(journal, 'fez_journal_esi'),
            ahci:
                getValueSearchKeyArray(journal, 'fez_journal_wos_category').find(
                    item => item.jnl_wos_category_lookup && item.jnl_wos_category_index === 'AHCI',
                ) ?? {},
            scie:
                getValueSearchKeyArray(journal, 'fez_journal_wos_category').find(
                    item => item.jnl_wos_category_lookup && item.jnl_wos_category_index === 'SCIE',
                ) ?? {},
            ssci:
                getValueSearchKeyArray(journal, 'fez_journal_wos_category').find(
                    item => item.jnl_wos_category_lookup && item.jnl_wos_category_index === 'SSCI',
                ) ?? {},
            esci:
                getValueSearchKeyArray(journal, 'fez_journal_wos_category').find(
                    item => item.jnl_wos_category_lookup && item.jnl_wos_category_index === 'ESCI',
                ) ?? {},
            scopus: !!getValueFromKey(journal, 'fez_journal_cite_score'),
            pubmed: !!getValueFromKey(journal, 'fez_journal_pubmed'),
        }),
    },
};
