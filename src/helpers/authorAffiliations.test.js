import { composeAuthorAffiliationProblems, hasValidOrgAffiliations, has100pcAffiliations } from './authorAffiliations';

const validRecord = {
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
    fez_record_search_key_author_id: [
        {
            rek_author_id_id: 35608391,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 7624839,
            rek_author_id_order: 1,
            author: {
                aut_id: 7624839,
                aut_orcid_id: null,
                aut_title: 'Mr',
                aut_org_username: 'uqslanca',
                aut_student_username: null,
            },
            rek_author_id_lookup: 'Lancaster, Steve',
        },
        {
            rek_author_id_id: 35608392,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 7624847,
            rek_author_id_order: 2,
            author: {
                aut_id: 7624847,
                aut_orcid_id: '0000-0003-3865-693X',
                aut_title: 'Mr',
                aut_org_username: 'uqlsibba',
                aut_student_username: null,
            },
            rek_author_id_lookup: 'Sibbald, Lee',
        },
        {
            rek_author_id_id: 35608393,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 0,
            rek_author_id_order: 3,
            author: null,
        },
    ],
};

const calcError = {
    fez_author_affiliation: [
        {
            af_id: 478908,
            af_pid: 'UQ:764e150',
            af_author_id: 7624839,
            af_percent_affiliation: 9999,
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
    fez_record_search_key_author_id: [
        {
            rek_author_id_id: 35608391,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 7624839,
            rek_author_id_order: 1,
            author: {
                aut_id: 7624839,
                aut_orcid_id: null,
                aut_title: 'Mr',
                aut_org_username: 'uqslanca',
                aut_student_username: null,
            },
            rek_author_id_lookup: 'Lancaster, Steve',
        },
        {
            rek_author_id_id: 35608392,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 7624847,
            rek_author_id_order: 2,
            author: {
                aut_id: 7624847,
                aut_orcid_id: '0000-0003-3865-693X',
                aut_title: 'Mr',
                aut_org_username: 'uqlsibba',
                aut_student_username: null,
            },
            rek_author_id_lookup: 'Sibbald, Lee',
        },
        {
            rek_author_id_id: 35608393,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 0,
            rek_author_id_order: 3,
            author: null,
        },
    ],
};

const oprhanError = {
    fez_author_affiliation: [
        {
            af_id: 478908,
            af_pid: 'UQ:764e150',
            af_author_id: 7624830,
            af_percent_affiliation: 100000,
            af_org_id: 1248,
            af_status: 1,
            fez_author: {
                aut_id: 7624830,
                aut_display_name: 'Author, New',
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
    fez_record_search_key_author_id: [
        {
            rek_author_id_id: 35608391,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 7624839,
            rek_author_id_order: 1,
            author: {
                aut_id: 7624839,
                aut_orcid_id: null,
                aut_title: 'Mr',
                aut_org_username: 'uqslanca',
                aut_student_username: null,
            },
            rek_author_id_lookup: 'Lancaster, Steve',
        },
        {
            rek_author_id_id: 35608392,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 7624847,
            rek_author_id_order: 2,
            author: {
                aut_id: 7624847,
                aut_orcid_id: '0000-0003-3865-693X',
                aut_title: 'Mr',
                aut_org_username: 'uqlsibba',
                aut_student_username: null,
            },
            rek_author_id_lookup: 'Sibbald, Lee',
        },
        {
            rek_author_id_id: 35608393,
            rek_author_id_pid: 'UQ:764e150',
            rek_author_id: 0,
            rek_author_id_order: 3,
            author: null,
        },
    ],
};

describe('Compose Author Affiliation Problems', () => {
    it('will have no valid affiliations for empty', () => {
        const Response = hasValidOrgAffiliations([{}], [{}]);
        expect(Response).toEqual(false);
    });
    it('will have no valid affiliations for no org affil', () => {
        const Response = hasValidOrgAffiliations({ rek_author_id: 1 }, [{ af_author_id: 1 }]);
        expect(Response).toEqual(false);
    });
    it('will have no valid calculation for empty', () => {
        const Response = has100pcAffiliations([{}], [{}]);
        expect(Response).toEqual(false);
    });
    it('will return false based on possible false scenarios', () => {
        let Response = has100pcAffiliations({ rek_author_id: 1 }, [{ af_author_id: 1, af_percent_affiliation: 99999 }]);
        expect(Response).toEqual(false);
        Response = has100pcAffiliations({ rek_author_id: 1 }, [{ af_author_id: 1 }]);
        expect(Response).toEqual(false);
        Response = has100pcAffiliations(null, null, null);
        expect(Response).toEqual(false);
        Response = has100pcAffiliations({}, [{ af_author_id: 1 }]);
        expect(Response).toEqual(false);
    });
    it('Will calculate a valid record', () => {
        const Response = composeAuthorAffiliationProblems(validRecord);
        const Expected = [];
        expect(Response).toEqual(Expected);
    });
    it('Will throw error on AA calculation error', () => {
        const Response = composeAuthorAffiliationProblems(calcError);
        const Expected = [
            {
                rek_author: 'Lancaster, Steve',
                has100pcAffiliations: false,
                hasOrgAffiliations: true,
                rek_author_id: 7624839,
            },
        ];
        expect(Response).toEqual(Expected);
    });
    it('Will throw error on AA orphaned organisation and calc error', () => {
        const Response = composeAuthorAffiliationProblems(oprhanError);
        const Expected = [
            {
                rek_author: 'Lancaster, Steve',
                has100pcAffiliations: false,
                hasOrgAffiliations: false,
                rek_author_id: 7624839,
            },
        ];
        expect(Response).toEqual(Expected);
    });
});
