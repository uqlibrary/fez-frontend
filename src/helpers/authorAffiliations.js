import { AUTHOR_AFFILIATIONS_ALLOWED_TYPES } from 'config/general';

export const TOTAL = 100;
export const PRECISION = 1000;
export const MAX_TOTAL = TOTAL * PRECISION;
export const NON_HERDC_ID = 1062;

export const ACTIONS = {
    ADD: 'add',
    CHANGE: 'change',
    DELETE: 'delete',
    NONHERDC: 'nonherdc',
    FIX: 'fix',
};

export const deepClone = obj => {
    return JSON.parse(JSON.stringify(obj));
};

export const getFilteredAffiliations = (author, affiliations) =>
    affiliations.length > 0
        ? affiliations?.filter(item => item.af_author_id === author.rek_author_id)
        : (author.affiliations ?? []);

export const hasValidAuthorAffiliations = record => {
    return record.fez_author_affiliation.every(item =>
        record.fez_record_search_key_author_id.some(author => item.af_author_id === author.rek_author_id),
    );
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

export const hasAffiliationProblems = (affiliations, total = MAX_TOTAL) => {
    return has100pcAffiliations({ affiliations, total }) === false;
};

export const hasAffiliationProblemsByAuthor = (author, total = MAX_TOTAL) => {
    return !!author.aut_id && author.aut_id !== 0 && has100pcAffiliations({ author, total }) === false;
};
export const getUniqueAffiliatedAuthorIds = affiliations =>
    affiliations?.reduce(
        (accumulated, current) =>
            accumulated.includes(current.af_author_id) ? accumulated : [...accumulated, current.af_author_id],
        [],
    ) ?? [];

export const isOrphanedAuthor = (record, authorId) =>
    !record.fez_record_search_key_author_id.some(author => author.rek_author_id === authorId);

export const composeAuthorAffiliationProblems = (record, nameIfAuthorUnavailable = '') => {
    const uniqueAffiliatedAuthorIds = getUniqueAffiliatedAuthorIds(record.fez_author_affiliation);
    const affiliationsNot100pc =
        record.fez_record_search_key_author_id
            ?.map((author, index) => {
                const hasAffiliations = uniqueAffiliatedAuthorIds.includes(author.rek_author_id);
                return {
                    rek_author_id: author?.rek_author_id ?? 0,
                    rek_author:
                        record.fez_record_search_key_author?.[index]?.rek_author ??
                        author?.rek_author_id_lookup ??
                        nameIfAuthorUnavailable,
                    has100pcAffiliations:
                        hasAffiliations &&
                        has100pcAffiliations({ author, affiliations: record.fez_author_affiliation }),
                    isNotOrphaned: true,
                };
            })
            .filter(item => item.rek_author_id !== 0 && !item.has100pcAffiliations) ?? [];

    const orphanedAuthors = uniqueAffiliatedAuthorIds
        .map(uniqueAuthorId => {
            const orphanedAuthor = isOrphanedAuthor(record, uniqueAuthorId)
                ? record.fez_author_affiliation.find(author => author.af_author_id === uniqueAuthorId)
                : undefined;
            return !!orphanedAuthor
                ? {
                      rek_author_id: orphanedAuthor.af_author_id,
                      rek_author: orphanedAuthor.fez_author?.aut_display_name ?? nameIfAuthorUnavailable,
                      has100pcAffiliations: true, // may not be true but doesn't actually matter for an orphan
                      isNotOrphaned: false,
                  }
                : undefined;
        })
        .filter(item => !!item);

    return [...affiliationsNot100pc, ...orphanedAuthors];
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
    const newAffiliations = deepClone(affiliations); // deep copy
    return hasNonHerdc(newAffiliations) ? returnNonHerdc(newAffiliations) : returnEvenSplit(newAffiliations);
};

export const editAffiliationReducer = (affiliations, action) => {
    let index;
    let newAffiliations = [];
    const clonedAffiliations = deepClone(affiliations);
    switch (action.type) {
        case ACTIONS.ADD:
            const addedAffiliation = action.affiliation;
            newAffiliations = [...clonedAffiliations, addedAffiliation];
            return calculateAffiliationPercentile(newAffiliations);
        case ACTIONS.CHANGE:
            const changedAffiliation = action.affiliation;
            index = clonedAffiliations.findIndex(item => item.af_id === changedAffiliation.af_id);
            newAffiliations = [
                ...clonedAffiliations.slice(0, index),
                changedAffiliation,
                ...clonedAffiliations.slice(index + 1),
            ];
            return calculateAffiliationPercentile(newAffiliations);
        case ACTIONS.DELETE:
            index = action.index;
            newAffiliations = [...clonedAffiliations.slice(0, index), ...clonedAffiliations.slice(index + 1)];
            return calculateAffiliationPercentile(newAffiliations);
        case ACTIONS.NONHERDC:
            const nonHerdcAffiliation = action.nonHerdcAffiliation;
            const suggestedAffiliation = action.suggestedAffiliation;
            newAffiliations = Array(nonHerdcAffiliation, suggestedAffiliation);
            return calculateAffiliationPercentile(newAffiliations);
        default:
            throw `Unknown action '${action.type}'`;
    }
};

export const createNewAffiliationObject = (rowData, organisation, id = Date.now()) => ({
    af_status: 1,
    af_author_id: rowData.aut_id,
    af_id: id,
    af_org_id: organisation.org_id,
    fez_author: { aut_id: rowData.aut_id, aut_display_name: rowData.aut_display_name },
    fez_org_structure: { ...organisation },
});

export const shouldHandleAuthorAffiliations = (displayType, subtype) =>
    AUTHOR_AFFILIATIONS_ALLOWED_TYPES?.[displayType]?.includes(subtype) ?? false;
