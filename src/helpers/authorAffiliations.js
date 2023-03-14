const MAX_TOTAL = 100000;

export const composeAuthorAffiliationProblems = record => {
    const uniqueAffiliations = record.fez_author_affiliation?.reduce(
        (accumulated, current) =>
            accumulated.includes(current.af_author_id) ? accumulated : [...accumulated, current.af_author_id],
        [],
    );

    if (!!!uniqueAffiliations) return [];

    // get list of authors that have an ID that isn't zero
    const authors = record.fez_record_search_key_author_id?.filter(author => author.rek_author_id !== 0);

    if (!!!authors) return [];

    return uniqueAffiliations
        .map(authorId => {
            const isOrphaned = authors.every(item => item.rek_author_id !== authorId);
            const matchingAuthor = record.fez_author_affiliation.find(item => item.af_author_id === authorId);
            return {
                rek_author_id: matchingAuthor.af_author_id,
                aut_display_name: matchingAuthor?.fez_author?.aut_display_name || '',
                isOrphaned: isOrphaned,
                isIncomplete: !isOrphaned
                    ? record.fez_author_affiliation
                          .filter(item => item.af_author_id === authorId)
                          .reduce((accumulated, current) => accumulated + current.af_percent_affiliation, 0) < MAX_TOTAL
                    : false,
            };
        })
        .filter(author => author.isOrphaned || author.isIncomplete);
};
