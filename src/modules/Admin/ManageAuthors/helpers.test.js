import { canAuthorsBeMerged, canSelectedAuthorsBeMerged } from './helpers';

describe('helpers', () => {
    it('canAuthorsBeMerged', async () => {
        expect(canAuthorsBeMerged()).toBeFalsy();
        expect(canAuthorsBeMerged({ aut_id: 1, aut_org_username: 'staff' })).toBeFalsy();
        expect(canAuthorsBeMerged({ aut_id: 1, aut_student_username: 'student' })).toBeFalsy();
        expect(canAuthorsBeMerged(undefined, { aut_id: 1, aut_org_username: 'staff' })).toBeFalsy();
        expect(canAuthorsBeMerged(undefined, { aut_id: 1, aut_student_username: 'student' })).toBeFalsy();
        expect(
            canAuthorsBeMerged({ aut_id: 1, aut_org_username: 'staff 1' }, { aut_id: 2, aut_org_username: 'staff 2' }),
        ).toBeFalsy();
        expect(
            canAuthorsBeMerged(
                { aut_id: 1, aut_student_username: 'student 1' },
                { aut_id: 2, aut_student_username: 'student 2' },
            ),
        ).toBeFalsy();

        expect(
            canAuthorsBeMerged(
                { aut_id: 1, aut_org_username: 'staff 1' },
                { aut_id: 2, aut_student_username: 'student 1' },
            ),
        ).toBeTruthy();
        expect(
            canAuthorsBeMerged(
                { aut_id: 2, aut_student_username: 'student 1' },
                { aut_id: 1, aut_org_username: 'staff 1' },
            ),
        ).toBeTruthy();
    });

    it('canSelectedAuthorsBeMerged', async () => {
        expect(canSelectedAuthorsBeMerged()).toBeFalsy();
        expect(canSelectedAuthorsBeMerged([{ aut_id: 1, aut_org_username: 'staff' }])).toBeFalsy();
        expect(
            canSelectedAuthorsBeMerged([
                { aut_id: 1, aut_org_username: 'staff 1' },
                { aut_id: 2, aut_student_username: 'student 1' },
            ]),
        ).toBeFalsy();
        expect(
            canSelectedAuthorsBeMerged(
                [
                    { aut_id: 1, aut_org_username: 'staff 1' },
                    { aut_id: 2, aut_student_username: 'student 1' },
                ],
                ['0'],
            ),
        ).toBeFalsy();
        expect(
            canSelectedAuthorsBeMerged(
                [
                    { aut_id: 1, aut_org_username: 'staff 1' },
                    { aut_id: 2, aut_student_username: 'student 1' },
                ],
                ['0', '2'],
            ),
        ).toBeFalsy();
        expect(
            canSelectedAuthorsBeMerged(
                [
                    { aut_id: 1, aut_org_username: 'staff 1' },
                    { aut_id: 2, aut_student_username: 'student 1' },
                ],
                ['0', '1'],
            ),
        ).toBeTruthy();
    });
});
