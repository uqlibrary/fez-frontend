import { navigateToEdit, authorAffiliates, createDefaultDrawerDescriptorObject } from './adminViewRecordObject';
import fields from 'locale/viewRecord';
import locale from '../locale/pages';
import recordWithAuthorAffiliates from '../mock/data/records/recordWithAuthorAffiliates';

describe('Author Affiliations', () => {
    const mockNavigate = jest.fn();
    it('Should correctly handle navigation', () => {
        const expected = '/admin/edit/UQ:1?tab=authors';
        navigateToEdit(mockNavigate, 'UQ:1');
        expect(mockNavigate).toBeCalledWith(expected);
    });
    it('should calculate affiliations correctly for valid affiliation data', () => {
        const KEY = 'fez_author_affiliation';
        const CONTENT = {
            fez_author_affiliation: [
                {
                    af_id: 478908,
                    af_pid: 'UQ:764e150',
                    af_author_id: 7624839,
                    af_percent_affiliation: 100000,
                    af_org_id: 1248,
                    af_status: 1,
                    fez_author: {
                        aut_id: 7624839,
                        aut_display_name: 'Lancaster, Steve',
                    },
                    fez_org_structure: [
                        {
                            org_id: 1248,
                            org_title: 'Information Systems and Resource Services (University of Queensland Library)',
                        },
                    ],
                },
                {
                    af_id: 478907,
                    af_pid: 'UQ:764e150',
                    af_author_id: 7624847,
                    af_percent_affiliation: 100000,
                    af_org_id: 1248,
                    af_status: 1,
                    fez_author: {
                        aut_id: 7624847,
                        aut_display_name: 'Sibbald, Lee',
                    },
                    fez_org_structure: [
                        {
                            org_id: 1248,
                            org_title: 'Information Systems and Resource Services (University of Queensland Library)',
                        },
                    ],
                },
            ],
        };

        const result = authorAffiliates(KEY, CONTENT, mockNavigate, 'UQ:1', []);
        expect(result).toEqual(fields.viewRecord.adminViewRecordDrawerFields.hasAffiliates);
    });

    it('should calculate affiliations correctly for no affiliate information', () => {
        const KEY = 'fez_author_affiliation';
        const CONTENT = {
            fez_author_affiliation: null,
        };

        const result = authorAffiliates(KEY, CONTENT, mockNavigate, 'UQ:1', []);
        expect(result).toEqual(fields.viewRecord.adminViewRecordDrawerFields.hasNoAffiliates);
    });

    it('should calculate affiliations correctly for invalid affiliation percentile', () => {
        const KEY = 'fez_author_affiliation';
        const PROBLEMS = [
            {
                rek_author_id: 7624839,
                aut_display_name: 'Lancaster, Steve',
                hasOrgAffiliations: true,
                has100pcAffiliations: false,
            },
        ];
        const CONTENT = {
            fez_author_affiliation: [
                {
                    af_id: 478908,
                    af_pid: 'UQ:764e150',
                    af_author_id: 7624839,
                    af_percent_affiliation: 90000,
                    af_org_id: 1248,
                    af_status: 1,
                    fez_author: {
                        aut_id: 7624839,
                        aut_display_name: 'Lancaster, Steve',
                    },
                    fez_org_structure: [
                        {
                            org_id: 1248,
                            org_title: 'Information Systems and Resource Services (University of Queensland Library)',
                        },
                    ],
                },
                {
                    af_id: 478907,
                    af_pid: 'UQ:764e150',
                    af_author_id: 7624847,
                    af_percent_affiliation: 100000,
                    af_org_id: 1248,
                    af_status: 1,
                    fez_author: {
                        aut_id: 7624847,
                        aut_display_name: 'Sibbald, Lee',
                    },
                    fez_org_structure: [
                        {
                            org_id: 1248,
                            org_title: 'Information Systems and Resource Services (University of Queensland Library)',
                        },
                    ],
                },
            ],
        };

        const result = JSON.stringify(authorAffiliates(KEY, CONTENT, mockNavigate, 'UQ:1', PROBLEMS));
        expect(result).toMatchSnapshot();
    });

    it('should calculate affiliations correctly for orphaned org affiliation', () => {
        const KEY = 'fez_author_affiliation';
        const PROBLEMS = [
            {
                rek_author_id: 7624839,
                aut_display_name: 'Lancaster, Steve',
                hasOrgAffiliations: false,
                has100pcAffiliations: true,
            },
        ];
        const CONTENT = {
            fez_author_affiliation: [
                {
                    af_id: 478908,
                    af_pid: 'UQ:764e150',
                    af_author_id: 7624839,
                    af_percent_affiliation: 100000,
                    af_org_id: 1248,
                    af_status: 1,
                    fez_author: {
                        aut_id: 7624839,
                        aut_display_name: 'Lancaster, Steve',
                    },
                },
                {
                    af_id: 478907,
                    af_pid: 'UQ:764e150',
                    af_author_id: 7624847,
                    af_percent_affiliation: 100000,
                    af_org_id: 1248,
                    af_status: 1,
                    fez_author: {
                        aut_id: 7624847,
                        aut_display_name: 'Sibbald, Lee',
                    },
                    fez_org_structure: [
                        {
                            org_id: 1248,
                            org_title: 'Information Systems and Resource Services (University of Queensland Library)',
                        },
                    ],
                },
            ],
        };

        const result = JSON.stringify(authorAffiliates(KEY, CONTENT, mockNavigate, 'UQ:1', PROBLEMS));
        expect(result).toMatchSnapshot();
    });

    describe('internal notes', () => {
        it('should handle null', () => {
            const content = createDefaultDrawerDescriptorObject(
                locale.pages.viewRecord.adminRecordData.drawer.sectionTitles,
                {
                    ...recordWithAuthorAffiliates,
                    fez_internal_notes: null,
                },
                fields.viewRecord.adminViewRecordDrawerFields,
            );
            expect(content.sections[0][1].value).toBe('-');
        });
        it('should handle empty', () => {
            const content = createDefaultDrawerDescriptorObject(
                locale.pages.viewRecord.adminRecordData.drawer.sectionTitles,
                {
                    ...recordWithAuthorAffiliates,
                    fez_internal_notes: {
                        ...recordWithAuthorAffiliates.fez_internal_notes,
                        ain_detail: ' ',
                    },
                },
                fields.viewRecord.adminViewRecordDrawerFields,
            );
            expect(content.sections[0][1].value).toBe('-');
        });
        it('should remove invalid html', () => {
            const content = createDefaultDrawerDescriptorObject(
                locale.pages.viewRecord.adminRecordData.drawer.sectionTitles,
                {
                    ...recordWithAuthorAffiliates,
                    fez_internal_notes: {
                        ...recordWithAuthorAffiliates.fez_internal_notes,
                        ain_detail: 'To: UQ eSpace Manager <espace@library.uq.edu.au>\n<b>test</b>',
                    },
                },
                fields.viewRecord.adminViewRecordDrawerFields,
            );
            console.log(content.sections[0]);
            expect(content.sections[0][1].value[0]).toBe('To: UQ eSpace Manager \n');
            expect(content.sections[0][1].value).toMatchSnapshot();
        });
    });
});
