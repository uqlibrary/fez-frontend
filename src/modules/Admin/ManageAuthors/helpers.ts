import { FezAuthor } from 'types/models/FezAuthor';
import { isEmptyString } from 'helpers/general';

export const canAuthorsBeMerged = (author?: FezAuthor, anotherAuthor?: FezAuthor) =>
    !!author &&
    !!anotherAuthor &&
    // first author is a student, second a staff
    ((!isEmptyString(author?.aut_student_username) &&
        isEmptyString(author?.aut_org_username) &&
        isEmptyString(anotherAuthor?.aut_student_username) &&
        !isEmptyString(anotherAuthor?.aut_org_username)) ||
        // first author is a staff, second a student
        (isEmptyString(author?.aut_student_username) &&
            !isEmptyString(author?.aut_org_username) &&
            !isEmptyString(anotherAuthor?.aut_student_username) &&
            isEmptyString(anotherAuthor?.aut_org_username)));

export const canSelectedAuthorsBeMerged = (data?: FezAuthor[], selection?: string[]) => {
    if (!data || selection?.length !== 2 || data?.length < Number(selection?.[1])) return false;
    return canAuthorsBeMerged(data[Number(selection?.[0])], data[Number(selection?.[1])]);
};
