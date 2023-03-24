export const TOTAL = 100;
export const PRECISION = 1000;
export const MAX_TOTAL = TOTAL * PRECISION;

export const hasValidOrgAffiliations = (author, affiliations) => {
    const filteredAffiliations = affiliations?.filter(item => item.af_author_id === author.rek_author_id);
    return filteredAffiliations.length > 0 && filteredAffiliations.every(item => !!item.fez_org_structure);
};

export const has100pcAffiliations = (author, affiliations, total = MAX_TOTAL) =>
    affiliations
        ?.filter(item => item.af_author_id === author.rek_author_id)
        .reduce((accumulated, current) => accumulated + current.af_percent_affiliation, 0) >= total;

export const getUniqueAffiliations = affiliations =>
    affiliations?.reduce(
        (accumulated, current) =>
            accumulated.includes(current.af_author_id) ? accumulated : [...accumulated, current.af_author_id],
        [],
    ) ?? [];

export const composeAuthorAffiliationProblems = record => {
    const uniqueAffiliations = getUniqueAffiliations(record.fez_author_affiliation);

    return (
        record.fez_record_search_key_author_id
            ?.map((author, index) => {
                const hasAffiliations = uniqueAffiliations.includes(author.rek_author_id);
                const hasOrgAffiliations =
                    hasAffiliations && hasValidOrgAffiliations(author, record.fez_author_affiliation);
                return {
                    rek_author_id: author.rek_author_id,
                    rek_author:
                        record.fez_record_search_key_author?.[index]?.rek_author ?? author.rek_author_id_lookup ?? '',
                    hasOrgAffiliations,
                    has100pcAffiliations:
                        hasAffiliations && has100pcAffiliations(author, record.fez_author_affiliation),
                };
            })
            .filter(item => item.rek_author_id !== 0 && (!item.hasOrgAffiliations || !item.has100pcAffiliations)) ?? []
    );
};
