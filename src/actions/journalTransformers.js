import moment from 'moment';

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
    const advisoryStatementValue =
        advisoryStatement?.text?.htmlText?.trim?.() || advisoryStatement?.text?.plainText?.trim?.() || null;
    return {
        ...rest,
        jnl_advisory_statement: advisoryStatementValue,
        jnl_advisory_statement_type: (advisoryStatementValue && advisoryStatement?.type) || null,
    };
};

export const getReadAndPublishSectionSearchKeys = (data = {}) => {
    // get values from the form
    const { readAndPublishSection = {}, adminSection = {}, bibliographicSection = {}, journal = {} } = data;
    const { readAndPublishPublisher = null, capped = null, discounted = null, s2o = null } = readAndPublishSection;
    const { issns = [] } = bibliographicSection;

    // if no read and publish values or no issns, return null
    if (!(readAndPublishPublisher || capped || discounted !== null || s2o) || issns.length === 0)
        return { fez_journal_read_and_publish: null };

    // check if issn still within the updated issns and the need to update the read and publish issn
    const readAndPublishIssn = journal.fez_journal_read_and_publish?.jnl_read_and_publish_issn;
    const updateIssn = !issns.some(issn => issn.rek_value.key === readAndPublishIssn);

    // nothing has changed
    if (
        !updateIssn &&
        journal.fez_journal_read_and_publish?.jnl_read_and_publish_publisher === readAndPublishPublisher &&
        journal.fez_journal_read_and_publish?.jnl_read_and_publish_is_capped === capped &&
        journal.fez_journal_read_and_publish?.jnl_read_and_publish_is_discounted === discounted &&
        journal.fez_journal_read_and_publish?.jnl_read_and_publish_is_s2o === s2o
    )
        return { fez_journal_read_and_publish: { ...journal.fez_journal_read_and_publish } };

    // if the current read and publish issn is not within the updated issns, get the first issn and return updated values
    return {
        fez_journal_read_and_publish: {
            jnl_read_and_publish_issn: updateIssn ? issns[0].rek_value.key : readAndPublishIssn,
            jnl_read_and_publish_title: adminSection.jnl_title,
            jnl_read_and_publish_publisher: readAndPublishPublisher
                ? readAndPublishPublisher
                : adminSection.jnl_publisher,
            jnl_read_and_publish_is_capped: capped,
            jnl_read_and_publish_is_discounted: discounted,
            jnl_read_and_publish_is_s2o: s2o,
            jnl_read_and_publish_source_date: moment().format('YYYY-MM-DD'),
        },
    };
};
