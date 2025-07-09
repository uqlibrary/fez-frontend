import React from 'react';
import { ContributorRowText } from './ContributorRowText';
import { rtlRender } from 'test-utils';
import { userIsAdmin } from 'hooks';

jest.mock('../../../../hooks');

const classes = {
    listContainer: 'listContainer',
    primary: 'primary',
    identifierName: 'identifierName',
    identifierSubtitle: 'identifierSubtitle',
};
const selectedClass = { selected: true };

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
                selectedClass={selectedClass}
                showRoleInput={false}
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
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
                showRoleInput={false}
                suffix={null}
                width="xs"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
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
                showRoleInput={false}
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-uq-details')).toBeInTheDocument();
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
                showRoleInput={false}
                suffix={null}
                width="xs"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-uq-details')).toBeInTheDocument();
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
                showRoleInput={false}
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-affiliation')).toBeInTheDocument();
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
                showRoleInput={false}
                suffix={null}
                width="xs"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-affiliation')).toBeInTheDocument();
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
                showRoleInput
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-role')).toBeInTheDocument();
    });

    it('should render three columns for researcher while adding datasets', () => {
        userIsAdmin.mockImplementation(() => false);

        const { getByTestId } = rtlRender(
            <ContributorRowText
                canEdit={false}
                classes={classes}
                contributor={{
                    nameAsPublished: 'Test, Testing',
                    creatorRole: 'Librarian',
                    aut_display_name: 'Test, Testing',
                    aut_org_username: 'uqtest',
                    aut_id: 123,
                }}
                index={0}
                showRoleInput
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-uq-details')).toBeInTheDocument();
        expect(getByTestId('test-list-row-role')).toBeInTheDocument();
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
                showRoleInput
                suffix={null}
                width="xs"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-role')).toBeInTheDocument();
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
                showRoleInput={false}
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-affiliation')).toBeInTheDocument();
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
                showRoleInput
                suffix={null}
                width="md"
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-affiliation')).toBeInTheDocument();
        expect(getByTestId('test-list-row-role')).toBeInTheDocument();
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
                showRoleInput={false}
                suffix={null}
                contributorRowId="test-list-row"
            />,
        );

        expect(getByTestId('test-list-row-name-as-published')).toBeInTheDocument();
        expect(getByTestId('test-list-row-uq-details')).toBeInTheDocument();
    });
});
