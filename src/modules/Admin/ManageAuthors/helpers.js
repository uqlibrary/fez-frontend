import { checkForExistingAuthor } from 'actions';
import { default as locale } from 'locale/components';

/* istanbul ignore next */
export const checkForExisting = (values, dispatch, props, field) =>
    dispatch(
        checkForExistingAuthor(
            values.get(field),
            field,
            values.get('aut_id'),
            locale.components.manageAuthors.editRow.validation,
            (!!props.asyncErrors && props.asyncErrors.toJS()) || {},
        ),
    );

const MAX_TOTAL = 100000;

export const composeAuthorAffiliationProblems = record => {
    const unique = record.fez_author_affiliation.reduce(
        (accumulated, current) =>
            accumulated.includes(current.af_author_id) ? accumulated : [...accumulated, current.af_author_id],
        [],
    );

    return record.fez_record_search_key_author_id
        .filter(author => author.rek_author_id !== 0)
        .map(author => {
            const isOrphaned = !unique.includes(author.rek_author_id);
            return {
                rek_author_id: author.rek_author_id,
                rek_author_id_lookup: author.rek_author_id_lookup,
                isOrphaned: isOrphaned,
                isIncomplete: !isOrphaned
                    ? record.fez_author_affiliation
                          .filter(item => item.af_author_id === author.rek_author_id)
                          .reduce((accumulated, current) => accumulated + current.af_percent_affiliation, 0) < MAX_TOTAL
                    : false,
            };
        })
        .filter(author => author.isOrphaned || author.isIncomplete);
};
