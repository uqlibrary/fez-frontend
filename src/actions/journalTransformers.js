export const getBibliographicSectionSearchKeys = (data = {}) => {
    const { issns = [] } = data;

    return {
        ...(issns.length > 0
            ? {
                  fez_journal_issn: issns.map(({ rek_value: value, rek_order: order }) => ({
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
