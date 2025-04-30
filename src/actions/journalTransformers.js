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
    const { advisoryStatement, advisoryStatementType, ...rest } = data;
    const advisoryStatementValue =
        advisoryStatement?.htmlText?.trim?.() || advisoryStatement?.plainText?.trim?.() || null;
    return {
        ...rest,
        jnl_advisory_statement: advisoryStatementValue,
        jnl_advisory_statement_type: (advisoryStatement && advisoryStatementType) || null,
    };
};
