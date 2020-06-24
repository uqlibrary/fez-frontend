import React from 'react';
import { ContributorRowText } from './ContributorRowText';
import { rtlRender } from 'test-utils';

jest.mock('../../../../hooks');
import { userIsAdmin } from 'hooks';

const classes = {
    listContainer: 'listContainer',
    primary: 'primary',
    identifierName: 'identifierName',
    identifierSubtitle: 'identifierSubtitle',
};

describe('ContributorRowText', () => {
    it('should render only one column for researcher while adding new non-NTRO work', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                }}
                index={0}
                selectedClass="test"
                showRoleInput={false}
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).toBe(1);
    });

    it('should render only one column for researcher while adding new non-NTRO work for smaller screen size', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                }}
                index={0}
                selectedClass="test"
                showRoleInput={false}
                suffix={null}
                width="xs"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).toBe(1);
    });

    it('should render two columns for researcher while adding new NTRO work (UQ affiliation)', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    aut_id: 123,
                    aut_title: 'Mr.',
                    aut_display_name: 'Test, Testing',
                    aut_org_username: null,
                    affiliation: 'UQ',
                    aut_student_username: 's123456',
                }}
                index={0}
                selectedClass="test"
                showRoleInput={false}
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(2);
    });

    it('should render two columns for researcher while adding new NTRO work (UQ affiliation) for smaller screen size', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    aut_id: 123,
                    aut_title: 'Mr.',
                    aut_display_name: 'Test, Testing',
                    aut_org_username: 'uqttesting',
                    affiliation: 'UQ',
                    uqUsername: 'uqtest',
                }}
                index={0}
                selectedClass="test"
                showRoleInput={false}
                suffix={null}
                width="xs"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(2);
    });

    it('should render two columns for researcher while adding new NTRO work (NotUQ affiliation)', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    affiliation: 'NotUQ',
                    orgaff: 'Some institution',
                    orgtype: '453989',
                }}
                index={0}
                selectedClass="test"
                showRoleInput={false}
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(2);
    });

    it('should render two columns for researcher while adding new NTRO work (NotUQ affiliation) for smaller screen size', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    affiliation: 'NotUQ',
                    orgaff: 'Some institution',
                }}
                index={0}
                selectedClass="test"
                showRoleInput={false}
                suffix={null}
                width="xs"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(2);
    });

    it('should render two columns for researcher while adding datasets', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    creatorRole: 'Librarian',
                }}
                index={0}
                selectedClass="test"
                showRoleInput
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(2);
    });

    it('should render two columns for researcher while adding datasets for smaller screen size', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    creatorRole: 'Librarian',
                }}
                index={0}
                selectedClass="test"
                showRoleInput
                suffix={null}
                width="xs"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(2);
    });

    it('should render two columns for admin while adding new work', () => {
        userIsAdmin.mockImplementation(() => true);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    affiliation: 'NotUQ',
                    orgaff: 'Some institution',
                    orgtype: '453989',
                }}
                index={0}
                selectedClass="test"
                showRoleInput={false}
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(2);
    });

    it('should display three columns for admin while adding datasets', () => {
        userIsAdmin.mockImplementation(() => true);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    affiliation: 'NotUQ',
                    orgaff: 'Some institution',
                    orgtype: '453989',
                    creatorRole: 'Some creator role',
                }}
                index={0}
                selectedClass="test"
                showRoleInput
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(3);
    });

    it('should render two columns for admin while adding new NTRO work (NotUQ affiliation) linking author', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    aut_id: 123,
                    aut_title: 'Mr.',
                    aut_display_name: 'Test, Testing',
                    aut_ref_num: 123456,
                    affiliation: 'NotUQ',
                    uqUsername: 'uqtest',
                }}
                index={0}
                selectedClass="test"
                showRoleInput={false}
                suffix={null}
                contributorRowId="test-list-row"
            />,
        );

        const contributorRow = getByTestId('contributor-row');
        expect(contributorRow.children.length).not.toBe(1);
        expect(contributorRow.children.length).toBe(2);
    });
});
