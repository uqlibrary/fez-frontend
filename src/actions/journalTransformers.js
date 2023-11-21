export const getBibliographicSectionSearchKeys = (data = {}) => {
    const { issns } = data;
    return {
        ...(!!issns
            ? {
                  fez_record_search_key_issn: issns.map(({ rek_value: value, rek_order: order }) => ({
                      rek_issn: value.key || value,
                      rek_issn_order: order,
                  })),
              }
            : {}),
    };
};

export const getAdminSectionSearchKeys = (data = {}) => {
    const { advisoryStatement, ...rest } = data;
    return {
        ...(!!advisoryStatement && !!(advisoryStatement?.htmlText ?? null)
            ? { jnl_advisory_statement: advisoryStatement.htmlText }
            : { jnl_advisory_statement: null }),
        ...rest,
    };
};
