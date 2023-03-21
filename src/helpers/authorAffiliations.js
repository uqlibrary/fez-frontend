const MAX_TOTAL = 100000;

export const composeAuthorAffiliationProblems = record => {
    const uniqueAffiliations = record.fez_author_affiliation?.reduce(
        (accumulated, current) =>
            accumulated.some(a => a.id === current.af_author_id)
                ? accumulated
                : [
                      ...accumulated,
                      { id: current.af_author_id, organisation: current.fez_org_structure, author: current.fez_author },
                  ],
        [],
    );

    if (!!!uniqueAffiliations) return [];

    // get list of authors that have an ID that isn't zero
    const authors = record.fez_record_search_key_author_id?.filter(author => author.rek_author_id !== 0);

    if (!!!authors) return [];

    return uniqueAffiliations
        .map(author => {
            const orgOrphaned = !author.organisation && !!author.author;
            const matchingAuthor = record.fez_author_affiliation.find(item => item.af_author_id === author.id);
            return {
                rek_author_id: matchingAuthor.af_author_id,
                aut_display_name: matchingAuthor?.fez_author?.aut_display_name || '',
                isOrphaned: orgOrphaned,
                isIncomplete: !orgOrphaned
                    ? record.fez_author_affiliation
                          .filter(item => item.af_author_id === author.id)
                          .reduce((accumulated, current) => accumulated + current.af_percent_affiliation, 0) < MAX_TOTAL
                    : false,
            };
        })
        .filter(author => author.isOrphaned || author.isIncomplete);
};
