import { getMergeableAuthors } from './helpers';

describe('helpers', () => {
    it('getMergeableAuthors', async () => {
        const staff = { aut_id: 1, aut_org_username: 'staff 1' };
        const student = { aut_id: 2, aut_student_username: 'student 1' };

        expect(getMergeableAuthors()).toBeFalsy();
        expect(getMergeableAuthors([staff, student])).toBeFalsy();
        expect(getMergeableAuthors([staff, staff], [0, 1])).toBeFalsy();
        expect(getMergeableAuthors([staff, {}, student], [0, 1])).toBeFalsy();

        const expected = { staff, student };
        expect(getMergeableAuthors([staff, student], [0, 1])).toEqual(expected);
        expect(getMergeableAuthors([{ ...student, aut_org_username: 'staff 3' }, staff], [0, 1])).toEqual({
            staff,
            student: { ...student, aut_org_username: 'staff 3' },
        });
        expect(
            getMergeableAuthors([staff, { aut_id: 3, aut_student_username: 'another author' }, student], [0, 2]),
        ).toEqual(expected);
    });
});
