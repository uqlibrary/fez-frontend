import { FezAuthor } from 'types/models/FezAuthor';
import { isEmptyString } from 'helpers/general';

const getStaffAuthor = (authors: FezAuthor[]) =>
    authors?.find(author => isEmptyString(author?.aut_student_username) && !isEmptyString(author?.aut_org_username));

const getStudentAuthor = (authors: FezAuthor[]) =>
    authors?.find(author => !isEmptyString(author?.aut_student_username));

export const getMergeableAuthors = (data?: FezAuthor[], selection?: string[]) => {
    if (!data || selection?.length !== 2 || data?.length < Number(selection?.[1])) return false;

    const selected = new Set(selection?.map(Number));
    const authors = data.filter((_, index) => selected.has(index));
    const staff = getStaffAuthor(authors);
    const student = getStudentAuthor(authors);

    if (!staff || !student || staff?.aut_id === student?.aut_id) return false;

    return { staff, student };
};
