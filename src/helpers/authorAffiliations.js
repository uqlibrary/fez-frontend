export const TOTAL = 100;
export const PRECISION = 1000;
export const MAX_TOTAL = TOTAL * PRECISION;
export const NON_HERDC_ID = 1062;

export const getFilteredAffiliations = (author, affiliations) =>
    affiliations.length > 0
        ? affiliations?.filter(item => item.af_author_id === author.rek_author_id)
        : author.affiliations ?? [];

export const hasValidOrgAffiliations = ({ author, affiliations = [] } = {}) => {
    let filteredAffiliations = [...affiliations];
    if (!!author) {
        filteredAffiliations = getFilteredAffiliations(author, affiliations);
    }
    return filteredAffiliations.length > 0 && filteredAffiliations.every(item => !!item.fez_org_structure);
};

export const has100pcAffiliations = ({ author, affiliations = [], total = MAX_TOTAL } = {}) => {
    let filteredAffiliations = [...affiliations];
    if (!!author) {
        filteredAffiliations = getFilteredAffiliations(author, affiliations);
    }

    return (
        filteredAffiliations.reduce((accumulated, current) => accumulated + current.af_percent_affiliation, 0) >= total
    );
};

export const hasAnyProblemAffiliations = ({ author, affiliations = [], total = MAX_TOTAL } = {}) => {
    if (!!author) {
        return (
            author.aut_id !== 0 &&
            (hasValidOrgAffiliations({ author }) === false || has100pcAffiliations({ author, total }) === false)
        );
    } else {
        return (
            hasValidOrgAffiliations({ affiliations }) === false ||
            has100pcAffiliations({ affiliations, total }) === false
        );
    }
};

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
                    hasAffiliations && hasValidOrgAffiliations({ author, affiliations: record.fez_author_affiliation });
                return {
                    rek_author_id: author.rek_author_id,
                    rek_author:
                        record.fez_record_search_key_author?.[index]?.rek_author ?? author.rek_author_id_lookup ?? '',
                    hasOrgAffiliations,
                    has100pcAffiliations:
                        hasAffiliations &&
                        has100pcAffiliations({ author, affiliations: record.fez_author_affiliation }),
                };
            })
            .filter(item => item.rek_author_id !== 0 && (!item.hasOrgAffiliations || !item.has100pcAffiliations)) ?? []
    );
};

export const isNonHerdc = affiliation => {
    const orgId = affiliation.org_id ?? affiliation.af_org_id ?? null;
    return orgId === NON_HERDC_ID;
};

export const hasNonHerdc = affiliations => affiliations.some(item => isNonHerdc(item));

const splitValue = (numToSplit, numSplits) => {
    const splitAmount = Math.floor(numToSplit / numSplits);
    const remainder = numToSplit % numSplits;
    const splits = new Array(numSplits).fill(splitAmount);

    for (let i = 0; i < remainder; i++) {
        splits[i]++;
    }
    return splits;
};

const returnNonHerdc = affiliations => {
    return affiliations.map(item => {
        item.af_percent_affiliation = item.af_org_id === NON_HERDC_ID ? MAX_TOTAL : 0;
        return item;
    });
};

const returnEvenSplit = affiliations => {
    const splitValues = splitValue(MAX_TOTAL, affiliations.length);
    return affiliations.map((item, index) => {
        item.af_percent_affiliation = splitValues[index];
        return item;
    });
};
export const calculateAffiliationPercentile = (affiliations = []) => {
    const newAffiliations = JSON.parse(JSON.stringify(affiliations)); // deep copy
    return hasNonHerdc(newAffiliations) ? returnNonHerdc(newAffiliations) : returnEvenSplit(newAffiliations);
};
