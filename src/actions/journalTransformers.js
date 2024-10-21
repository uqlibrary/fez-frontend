const transformObjectToArray = obj => {
    const ret = [];
    // eslint-disable-next-line no-unused-vars
    for (const [_, value] of Object.entries(obj)) {
        ret.push(value);
    }
    return ret;
};
export const getBibliographicSectionSearchKeys = (data = {}) => {
    const { issns } = data;
    // this shouldnt really be necessary but once the order of ISSNs is changed
    // the issns object is no longer an array. This may also happen if new items are
    // added or existing items removed.
    const _issns = typeof issns !== 'object' ? issns : transformObjectToArray(issns);

    return {
        ...(!!_issns
            ? {
                  fez_journal_issn: _issns.map(({ rek_value: value, rek_order: order }) => ({
                      jnl_issn: value.key || value,
                      jnl_issn_order: order,
                  })),
              }
            : {}),
    };
};

export const getAdminSectionSearchKeys = (data = {}) => {
    const { advisoryStatement, ...rest } = data;
    return {
        ...(!!advisoryStatement && !!(advisoryStatement?.htmlText ?? advisoryStatement.plainText ?? null)
            ? { jnl_advisory_statement: advisoryStatement.htmlText || advisoryStatement.plainText }
            : { jnl_advisory_statement: null }),
        ...rest,
    };
};
