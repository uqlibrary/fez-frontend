import React from 'react';
import { ntro, ntro2, ntroMinimal } from 'mock/data/testing/records';
import NtroDetails from './NtroDetails';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        theme: {},
        publication: testProps.publication || ntro,
        account: testProps.account || { canMasquerade: true },
        ...testProps,
    };
    return rtlRender(<NtroDetails {...props} />);
}

describe('NtroDetails ', () => {
    it('renders component as expected', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders null for a non NTRO subtype', () => {
        const { container } = setup({
            publication: {
                ...ntro,
                rek_subtype: 'this isnt NTRO',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders minor significance as an admin', () => {
        const { container } = setup({
            account: { canMasquerade: false },
            publication: {
                ...ntro,
                fez_record_search_key_significance: [
                    {
                        rek_significance_id: 214,
                        rek_significance_pid: 'UQ:ec5ce03',
                        rek_significance: 454027,
                        rek_significance_order: 1,
                        rek_significance_lookup: 'Minor',
                    },
                    {
                        rek_significance_id: 215,
                        rek_significance_pid: 'UQ:ec5ce03',
                        rek_significance: 0,
                        rek_significance_order: 2,
                    },
                    {
                        rek_significance_id: 216,
                        rek_significance_pid: 'UQ:ec5ce03',
                        rek_significance: '',
                        rek_significance_order: 3,
                    },
                ],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders minor significance as an admin', () => {
        const { container } = setup({
            account: { canMasquerade: true },
            publication: {
                ...ntro,
                fez_record_search_key_significance: [
                    {
                        rek_significance_id: 214,
                        rek_significance_pid: 'UQ:ec5ce03',
                        rek_significance: 454027,
                        rek_significance_order: 1,
                        rek_significance_lookup: 'Minor',
                    },
                    {
                        rek_significance_id: 215,
                        rek_significance_pid: 'UQ:ec5ce03',
                        rek_significance: 0,
                        rek_significance_order: 2,
                    },
                    {
                        rek_significance_id: 216,
                        rek_significance_pid: 'UQ:ec5ce03',
                        rek_significance: '',
                        rek_significance_order: 3,
                    },
                    {
                        rek_significance_id: 217,
                        rek_significance_pid: 'UQ:ec5ce03',
                        rek_significance: '',
                        rek_significance_order: 4,
                    },
                ],
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement_id: 293,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: 'A statement',
                        rek_creator_contribution_statement_order: 1,
                    },
                    {
                        rek_creator_contribution_statement_id: 294,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: '     ',
                        rek_creator_contribution_statement_order: 2,
                    },
                    {
                        rek_creator_contribution_statement_id: 295,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: '',
                        rek_creator_contribution_statement_order: 3,
                    },
                    {
                        rek_creator_contribution_statement_id: 296,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: '',
                        rek_creator_contribution_statement_order: 4,
                    },
                ],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders contribution statement not as an admin', () => {
        const { container } = setup({
            account: { canMasquerade: false },
            publication: {
                ...ntro,
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement_id: 293,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: 'A statement',
                        rek_creator_contribution_statement_order: 1,
                    },
                    {
                        rek_creator_contribution_statement_id: 294,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: '     ',
                        rek_creator_contribution_statement_order: 2,
                    },
                    {
                        rek_creator_contribution_statement_id: 294,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: '',
                        rek_creator_contribution_statement_order: 3,
                    },
                ],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders contribution statement as an admin with a blank statement', () => {
        const { container } = setup({
            account: { canMasquerade: true },
            publication: {
                ...ntro,
                fez_record_search_key_creator_contribution_statement: [
                    {
                        rek_creator_contribution_statement_id: 293,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: 'A statement',
                        rek_creator_contribution_statement_order: 1,
                    },
                    {
                        rek_creator_contribution_statement_id: 294,
                        rek_creator_contribution_statement_pid: 'UQ:ec5ce03',
                        rek_creator_contribution_statement: ' ',
                        rek_creator_contribution_statement_order: 2,
                    },
                ],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders the abstract according to html or plain', () => {
        const { container } = setup({
            account: { canMasquerade: true },
            publication: {
                ...ntro,
                rek_formatted_abstract: null,
                rek_description: 'Plain text abstract',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('does not render the abstract at all', () => {
        const { container } = setup({
            account: { canMasquerade: true },
            publication: {
                ...ntro,
                rek_formatted_abstract: null,
                rek_description: null,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders ISMN correctly', () => {
        const { container } = setup({
            account: { canMasquerade: true },
            publication: {
                ...ntro,
                fez_record_search_key_ismn: [{ rek_ismn: 12345 }, { rek_ismn: 67890 }],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders ISRC correctly', () => {
        const { container } = setup({
            account: { canMasquerade: true },
            publication: {
                ...ntro,
                fez_record_search_key_isrc: [{ rek_isrc: 12345 }, { rek_isrc: 67890 }],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders start/end page correctly due to correct doc/sub types', () => {
        const { container } = setup({
            publication: {
                ...ntro,
                rek_display_type_lookup: 'Creative Work',
                rek_subtype: 'Creative Work - Other',
                fez_record_search_key_start_page: {
                    rek_start_page: 1,
                },
                fez_record_search_key_end_page: {
                    rek_end_page: 2,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders start/end page correctly due to incorrect doc/sub types', () => {
        const { container } = setup({
            publication: {
                ...ntro,
                rek_display_type_lookup: 'Journal Article',
                rek_subtype: 'Creative Work - Textual Work',
                fez_record_search_key_start_page: {
                    rek_start_page: 1,
                },
                fez_record_search_key_end_page: {
                    rek_end_page: 2,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders audience size correctly', () => {
        const { container } = setup({
            publication: {
                ...ntro,
                fez_record_search_key_audience_size: {
                    rek_audience_size: 999,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders audience size correctly', () => {
        const { container } = setup({
            publication: {
                ...ntro,
                fez_record_search_key_audience_size: {
                    rek_audience_size: 453992,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render empty component', () => {
        const { container } = setup({
            publication: {},
            account: { canMasquerade: false },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with record', () => {
        const { container } = setup({
            publication: ntro2,
            account: { canMasquerade: false },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render default fields for record with missing lookups', () => {
        const { container } = setup({
            publication: ntroMinimal,
            account: { canMasquerade: false },
        });
        expect(container).toMatchSnapshot();
    });

    it('should show admin only fields when admin user', () => {
        const { container } = setup({ publication: ntro2 });
        expect(container).toMatchSnapshot();
    });
});
