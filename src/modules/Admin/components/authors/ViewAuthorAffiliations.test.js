import React from 'react';
import ViewAuthorAffiliations from './ViewAuthorAffiliations';
import { rtlRender } from 'test-utils';
import locale from 'locale/components';

function setup(props = {}) {
    const tempLocale = locale.components.authorsList('');
    const {
        field: {
            form: {
                locale: { affiliations: affiliationsLocale },
            },
        },
    } = tempLocale;

    const testProps = {
        rowData: {},
        locale: affiliationsLocale,
        onChange: jest.fn(),
        ...props,
    };
    return rtlRender(<ViewAuthorAffiliations {...testProps} />);
}

describe('ViewAuthorAffiliations', () => {
    it('renders', () => {
        const { getByText, getByTestId } = setup();

        expect(getByTestId('orgChip-error')).toHaveTextContent('0%');
        expect(getByText('No affiliations have been added')).toBeInTheDocument();
        expect(getByText('Author requires at least one affiliation to be added')).toBeInTheDocument();
    });

    it('renders a row without problems', () => {
        const rowData = {
            creatorRole: '',
            uqIdentifier: '1',
            aut_display_name: 'User, Test',
            affiliation: 'UQ',
            aut_org_username: 'uqtest',
            nameAsPublished: 'User, Test',
            uqUsername: 'uqtest',
            aut_student_username: '',
            aut_id: 1,
            orgaff: 'The University of Queensland',
            orgtype: '1',
            affiliations: [
                {
                    af_id: 1,
                    af_pid: 'UQ:100000',
                    af_author_id: 1,
                    af_percent_affiliation: 100000,
                    af_org_id: 1,
                    af_status: 1,
                    fez_author: {
                        aut_id: 1,
                        aut_display_name: 'Good, All',
                    },
                    fez_org_structure: {
                        org_id: 1,
                        org_title: 'Information Systems and Resource Services (University of Queensland Library)',
                    },
                },
            ],
        };
        const { getByText, getByTestId } = setup({ rowData });
        expect(getByTestId('orgChip-1')).toHaveTextContent('100%');
        expect(
            getByText('Information Systems and Resource Services (University of Queensland Library)'),
        ).toBeInTheDocument();
    });

    it('renders a row with missing org name (coverage)', () => {
        const rowData = {
            creatorRole: '',
            uqIdentifier: '1',
            aut_display_name: 'User, Test',
            affiliation: 'UQ',
            aut_org_username: 'uqtest',
            nameAsPublished: 'User, Test',
            uqUsername: 'uqtest',
            aut_student_username: '',
            aut_id: 1,
            orgaff: 'The University of Queensland',
            orgtype: '1',
            affiliations: [
                {
                    af_id: 1,
                    af_pid: 'UQ:100000',
                    af_author_id: 1,
                    af_percent_affiliation: 100000,
                    af_org_id: 1,
                    af_status: 1,
                    fez_author: {
                        aut_id: 1,
                        aut_display_name: 'Good, All',
                    },
                },
            ],
        };
        const { getByText, getByTestId } = setup({ rowData });
        expect(getByTestId('orgChip-1')).toHaveTextContent('100%');

        expect(getByText('Organisational Unit data missing')).toBeInTheDocument();
    });

    it('renders a row with percentile error', () => {
        const rowData = {
            creatorRole: '',
            uqIdentifier: '1',
            aut_display_name: 'User, Test',
            affiliation: 'UQ',
            aut_org_username: 'uqtest',
            nameAsPublished: 'User, Test',
            uqUsername: 'uqtest',
            aut_student_username: '',
            aut_id: 1,
            orgaff: 'The University of Queensland',
            orgtype: '1',
            affiliations: [
                {
                    af_id: 1,
                    af_pid: 'UQ:100000',
                    af_author_id: 1,
                    af_percent_affiliation: 80000,
                    af_org_id: 1,
                    af_status: 1,
                    fez_author: {
                        aut_id: 1,
                        aut_display_name: 'Good, All',
                    },
                    fez_org_structure: {
                        org_id: 1,
                        org_title: 'Information Systems and Resource Services (University of Queensland Library)',
                    },
                },
            ],
        };
        const onChange = jest.fn(row => expect(row.affiliations[0].af_percent_affiliation).toEqual(100000));
        const { getByText, getByTestId, getByRole } = setup({ rowData, onChange });

        expect(getByTestId('orgChip-1')).toHaveTextContent('80%');
        expect(getByText('Percentage sum total of all affiliations must equal 100%')).toBeInTheDocument();

        // coverage - make sure recalculate button fires. Note the jest.fn for onChange
        // also contains an expect() to ensure the recalculated figure is supplied and correct
        expect(getByRole('button', { name: /Recalculate Percentages/ })).toBeInTheDocument();
        getByRole('button', { name: /Recalculate Percentages/ }).click();

        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('renders a row with missing affiliation error', () => {
        const rowData = {
            creatorRole: '',
            uqIdentifier: '1',
            aut_display_name: 'User, Test',
            affiliation: 'UQ',
            aut_org_username: 'uqtest',
            nameAsPublished: 'User, Test',
            uqUsername: 'uqtest',
            aut_student_username: '',
            aut_id: 1,
            orgaff: 'The University of Queensland',
            orgtype: '1',
            affiliations: [],
        };
        const { getByText, getByTestId } = setup({ rowData });
        expect(getByTestId('orgChip-error')).toHaveTextContent('0%');
        expect(getByText('Author requires at least one affiliation to be added')).toBeInTheDocument();
    });
});
