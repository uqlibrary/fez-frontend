import * as helpers from './authorAffiliations';
import { recordWithProblematicAuthorAffiliations as record } from 'mock/data';

const testAuthor = { rek_author_id: 88844 };

describe('Author Affiliation helper functions:', () => {
    it('getFilteredAffiliations', () => {
        const testAffils = helpers.deepClone(record.fez_author_affiliation);

        // test both params being sent, which should filter testAffils by testAuthor id
        expect(helpers.getFilteredAffiliations(testAuthor, testAffils)).toEqual([
            {
                af_author_id: 88844,
                af_id: 478894,
                af_org_id: 881,
                af_percent_affiliation: 50000,
                af_pid: 'UQ:871c1f8',
                af_status: 1,
                fez_author: { aut_display_name: 'Robertson, Avril A. B.', aut_id: 88844 },
                fez_org_structure: { org_id: 881, org_title: 'School of Chemistry and Molecular Biosciences' },
            },
            {
                af_author_id: 88844,
                af_id: 478895,
                af_org_id: 968,
                af_percent_affiliation: 40000,
                af_pid: 'UQ:871c1f8',
                af_status: 1,
                fez_author: { aut_display_name: 'Robertson, Avril A. B.', aut_id: 88844 },
                fez_org_structure: { org_id: 968, org_title: 'Institute for Molecular Bioscience' },
            },
        ]);

        // test when only author is sent as a param, which should return
        // the author.affiliations array (if available)
        const modifiedAuthor = helpers.deepClone(testAuthor);
        const affils = helpers.deepClone(testAffils[0]);
        modifiedAuthor.affiliations = [affils];
        expect(helpers.getFilteredAffiliations(modifiedAuthor, [])).toEqual([affils]);

        // should return empty array if neither of the two options are available
        delete modifiedAuthor.affiliations;
        expect(helpers.getFilteredAffiliations(modifiedAuthor, [])).toEqual([]);
    });

    it('hasValidAuthorAffiliations', () => {
        // by default, record has problem affils
        expect(helpers.hasValidAuthorAffiliations(record)).toEqual(false);

        // check what happens after removing the problem affils
        const testRecord = helpers.deepClone(record);
        testRecord.fez_author_affiliation.pop();
        testRecord.fez_author_affiliation.pop();
        expect(helpers.hasValidAuthorAffiliations(testRecord)).toEqual(true);
    });

    it('has100pcAffiliations', () => {
        const affiliations = helpers.deepClone(record.fez_author_affiliation);
        const affiliationsByAuthor = helpers.deepClone(helpers.getFilteredAffiliations(testAuthor, affiliations));

        // uses defaults (coverage)
        expect(helpers.has100pcAffiliations()).toBe(false);

        // doesnt total 100 for test author id
        expect(helpers.has100pcAffiliations({ author: testAuthor, affiliations })).toBe(false);

        // but should if we adjust what total we're looking for
        expect(
            helpers.has100pcAffiliations({
                author: testAuthor,
                affiliations,
                total: 90000,
            }),
        ).toBe(true);

        // should also return true if we adjust the % figures in the affil array
        affiliations[1].af_percent_affiliation = 50000;
        expect(helpers.has100pcAffiliations({ author: testAuthor, affiliations })).toBe(true);

        // also works when only affiliation array passed
        expect(helpers.has100pcAffiliations({ affiliations: affiliationsByAuthor })).toBe(false);
        affiliationsByAuthor[0].af_percent_affiliation = 100000;
        affiliationsByAuthor.pop();

        expect(helpers.has100pcAffiliations({ affiliations: affiliationsByAuthor })).toBe(true);
    });

    it('hasAffiliationProblems', () => {
        const affiliationsByAuthor = helpers.deepClone(
            helpers.getFilteredAffiliations(testAuthor, record.fez_author_affiliation),
        );
        expect(helpers.hasAffiliationProblems(affiliationsByAuthor)).toBe(true);
        expect(helpers.hasAffiliationProblems(affiliationsByAuthor, 90000)).toBe(false);
    });

    it('hasAffiliationProblemsByAuthor', () => {
        const affiliations = helpers.deepClone(
            helpers.getFilteredAffiliations(testAuthor, record.fez_author_affiliation),
        );
        const testAuthorWithAffiliations = {
            aut_id: 88844,
            affiliations,
        };
        expect(helpers.hasAffiliationProblemsByAuthor(testAuthorWithAffiliations)).toBe(true);
        expect(helpers.hasAffiliationProblemsByAuthor(testAuthorWithAffiliations, 90000)).toBe(false);
        testAuthorWithAffiliations.aut_id = 0;
        expect(helpers.hasAffiliationProblemsByAuthor(testAuthorWithAffiliations, 90000)).toBe(false);
        delete testAuthorWithAffiliations.aut_id;
        expect(helpers.hasAffiliationProblemsByAuthor(testAuthorWithAffiliations, 90000)).toBe(false);
    });

    it('getUniqueAffiliatedAuthorIds', () => {
        // coverage
        expect(helpers.getUniqueAffiliatedAuthorIds()).toEqual([]);
        expect(helpers.getUniqueAffiliatedAuthorIds([])).toEqual([]);

        expect(helpers.getUniqueAffiliatedAuthorIds(record.fez_author_affiliation)).toEqual([
            88844, 7624000, 7624839, 7624840, 7624841,
        ]);
    });

    it('isOrphanedAuthor', () => {
        expect(helpers.isOrphanedAuthor(record, 88844)).toBe(false); // has affiliations
        expect(helpers.isOrphanedAuthor(record, 7624840)).toBe(true); // has no affiliation
    });

    it('isNonHerdc', () => {
        expect(helpers.isNonHerdc({})).toBe(false);
        expect(helpers.isNonHerdc({ org_id: 1 })).toBe(false);
        expect(helpers.isNonHerdc({ af_org_id: 1 })).toBe(false);
        expect(helpers.isNonHerdc({ org_id: helpers.NON_HERDC_ID })).toBe(true);
        expect(helpers.isNonHerdc({ af_org_id: helpers.NON_HERDC_ID })).toBe(true);
    });

    it('hasNonHerdc', () => {
        expect(helpers.hasNonHerdc(record.fez_author_affiliation)).toBe(false);
        expect(helpers.hasNonHerdc([{ org_id: helpers.NON_HERDC_ID }, { org_id: 1 }])).toBe(true);
        expect(helpers.hasNonHerdc([{ af_org_id: 1 }, { af_org_id: helpers.NON_HERDC_ID }])).toBe(true);
    });

    it('calculateAffiliationPercentile', () => {
        expect(helpers.calculateAffiliationPercentile([{ org_id: helpers.NON_HERDC_ID }, { org_id: 1 }])).toEqual([
            {
                af_percent_affiliation: 0,
                org_id: 1062,
            },
            {
                af_percent_affiliation: 0,
                org_id: 1,
            },
        ]);
        expect(helpers.calculateAffiliationPercentile([{ af_org_id: helpers.NON_HERDC_ID }, { org_id: 1 }])).toEqual([
            {
                af_percent_affiliation: 100000,
                af_org_id: 1062,
            },
            {
                af_percent_affiliation: 0,
                org_id: 1,
            },
        ]);
        expect(helpers.calculateAffiliationPercentile([{ af_org_id: helpers.NON_HERDC_ID }])).toEqual([
            {
                af_percent_affiliation: 100000,
                af_org_id: 1062,
            },
        ]);
        expect(helpers.calculateAffiliationPercentile([{ af_org_id: 1 }])).toEqual([
            {
                af_percent_affiliation: 100000,
                af_org_id: 1,
            },
        ]);
        expect(helpers.calculateAffiliationPercentile([{ af_org_id: 1 }, { af_org_id: 2 }])).toEqual([
            {
                af_percent_affiliation: 50000,
                af_org_id: 1,
            },
            {
                af_percent_affiliation: 50000,
                af_org_id: 2,
            },
        ]);
        expect(helpers.calculateAffiliationPercentile([{ af_org_id: 1 }, { af_org_id: 2 }, { af_org_id: 3 }])).toEqual([
            {
                af_percent_affiliation: 33334,
                af_org_id: 1,
            },
            {
                af_percent_affiliation: 33333,
                af_org_id: 2,
            },
            {
                af_percent_affiliation: 33333,
                af_org_id: 3,
            },
        ]);
    });

    it('composeAuthorAffiliationProblems', () => {
        const recordClone = helpers.deepClone(record);
        const expected1 = [
            {
                has100pcAffiliations: false,
                isNotOrphaned: true,
                rek_author: 'Robertson, Avril A. B. not 100%',
                rek_author_id: 88844,
            },
            {
                has100pcAffiliations: false,
                isNotOrphaned: true,
                rek_author: 'Sibbald, Lee No Affil',
                rek_author_id: 7624829,
            },
            {
                has100pcAffiliations: true,
                isNotOrphaned: false,
                rek_author: 'Affiliate, Orphaned',
                rek_author_id: 7624840,
            },
            {
                has100pcAffiliations: true,
                isNotOrphaned: false,
                rek_author: 'This work',
                rek_author_id: 7624841,
            },
        ];
        const expected2 = [
            {
                has100pcAffiliations: false,
                isNotOrphaned: true,
                rek_author: 'Robertson, Avril A. B. not 100%',
                rek_author_id: 88844,
            },
            {
                has100pcAffiliations: false,
                isNotOrphaned: true,
                rek_author: 'Sibbald, Lee No Affil',
                rek_author_id: 7624829,
            },
            {
                has100pcAffiliations: true,
                isNotOrphaned: false,
                rek_author: 'Affiliate, Orphaned',
                rek_author_id: 7624840,
            },
        ];

        const expected3 = [
            {
                has100pcAffiliations: false,
                isNotOrphaned: true,
                rek_author: 'Robertson, Avril A. B. not 100%',
                rek_author_id: 88844,
            },
            {
                has100pcAffiliations: false,
                isNotOrphaned: true,
                rek_author: 'Lancaster, Steve No Org',
                rek_author_id: 7624839,
            },
            {
                has100pcAffiliations: false,
                isNotOrphaned: true,
                rek_author: 'Sibbald, Lee No Affil',
                rek_author_id: 7624829,
            },
            {
                has100pcAffiliations: false,
                isNotOrphaned: true,
                rek_author: 'Good, All No Issues',
                rek_author_id: 7624000,
            },
        ];

        const expected4 = [
            {
                has100pcAffiliations: true,
                isNotOrphaned: false,
                rek_author: 'Robertson, Avril A. B.',
                rek_author_id: 88844,
            },
            {
                has100pcAffiliations: true,
                isNotOrphaned: false,
                rek_author: 'Good, All',
                rek_author_id: 7624000,
            },
            {
                has100pcAffiliations: true,
                isNotOrphaned: false,
                rek_author: 'Lancaster, Steve.',
                rek_author_id: 7624839,
            },
            {
                has100pcAffiliations: true,
                isNotOrphaned: false,
                rek_author: 'Affiliate, Orphaned',
                rek_author_id: 7624840,
            },
            {
                has100pcAffiliations: true,
                isNotOrphaned: false,
                rek_author: '',
                rek_author_id: 7624841,
            },
        ];

        // coverage
        const recordCloneCoverage = helpers.deepClone(recordClone);
        expect(
            helpers.composeAuthorAffiliationProblems({
                ...recordCloneCoverage,
                fez_author_affiliation: [],
                fez_record_search_key_author_id: null,
            }),
        ).toEqual([]);
        recordCloneCoverage.fez_record_search_key_author[6].rek_author = null;
        recordCloneCoverage.fez_record_search_key_author_id[6].rek_author_id_lookup = 'Test name';
        expect(helpers.composeAuthorAffiliationProblems(recordCloneCoverage)[0]).toEqual(
            expect.objectContaining({ rek_author: 'Test name' }),
        );
        recordCloneCoverage.fez_record_search_key_author_id[6].rek_author_id_lookup = null;
        expect(helpers.composeAuthorAffiliationProblems(recordCloneCoverage)[0]).toEqual(
            expect.objectContaining({ rek_author: '' }),
        );

        expect(helpers.composeAuthorAffiliationProblems(recordClone, 'This work')).toEqual(expected1);

        // remove an affiliation
        recordClone.fez_author_affiliation.pop();
        expect(helpers.composeAuthorAffiliationProblems(recordClone)).toEqual(expected2);

        // remove all affiliations, should report issues with all linked authors
        recordClone.fez_author_affiliation = [];
        expect(helpers.composeAuthorAffiliationProblems(recordClone)).toEqual(expected3);

        // remove authors, should return orphaned flag for all affiliations
        recordClone.fez_author_affiliation = helpers.deepClone(record.fez_author_affiliation);
        recordClone.fez_record_search_key_author_id = [];
        expect(helpers.composeAuthorAffiliationProblems(recordClone)).toEqual(expected4);

        // remove authors and affiliations, should return no problems
        recordClone.fez_author_affiliation = [];
        recordClone.fez_record_search_key_author_id = [];
        expect(helpers.composeAuthorAffiliationProblems(recordClone)).toEqual([]);
    });

    it('editAffiliationReducer', () => {
        const affiliations = [
            { af_id: 1, af_org_id: 1, org_title: 'Title 1', af_percent_affiliation: 50000 },
            { af_id: 2, af_org_id: 2, org_title: 'Title 2', af_percent_affiliation: 50000 },
        ];

        // Add
        expect(
            helpers.editAffiliationReducer(affiliations, {
                type: helpers.ACTIONS.ADD,
                affiliation: { af_id: 3, af_org_id: 3, org_title: 'Title 3' },
            }),
        ).toEqual([
            {
                af_id: 1,
                af_org_id: 1,
                org_title: 'Title 1',
                af_percent_affiliation: 33334,
            },
            {
                af_id: 2,
                af_org_id: 2,
                org_title: 'Title 2',
                af_percent_affiliation: 33333,
            },
            {
                af_id: 3,
                af_org_id: 3,
                org_title: 'Title 3',
                af_percent_affiliation: 33333,
            },
        ]);

        // Change
        expect(
            helpers.editAffiliationReducer(affiliations, {
                type: helpers.ACTIONS.CHANGE,
                affiliation: { af_id: 2, af_org_id: 2, org_title: 'Title Two' },
            }),
        ).toEqual([
            {
                af_id: 1,
                af_org_id: 1,
                org_title: 'Title 1',
                af_percent_affiliation: 50000,
            },
            {
                af_id: 2,
                af_org_id: 2,
                org_title: 'Title Two',
                af_percent_affiliation: 50000,
            },
        ]);

        // Delete
        expect(
            helpers.editAffiliationReducer(affiliations, {
                type: helpers.ACTIONS.DELETE,
                index: 0,
            }),
        ).toEqual([
            {
                af_id: 2,
                af_org_id: 2,
                org_title: 'Title 2',
                af_percent_affiliation: 100000,
            },
        ]);

        // Non HERDC
        expect(
            helpers.editAffiliationReducer(affiliations, {
                type: helpers.ACTIONS.NONHERDC,
                nonHerdcAffiliation: {
                    af_id: 100,
                    af_org_id: 100,
                    org_title: 'Non-Herdc Title',
                    af_percent_affiliation: 0,
                },
                suggestedAffiliation: {
                    af_id: 2,
                    af_org_id: 2,
                    org_title: 'Suggested Title',
                    af_percent_affiliation: 0,
                },
            }),
        ).toEqual([
            {
                af_id: 100,
                af_org_id: 100,
                af_percent_affiliation: 50000,
                org_title: 'Non-Herdc Title',
            },
            {
                af_id: 2,
                af_org_id: 2,
                af_percent_affiliation: 50000,
                org_title: 'Suggested Title',
            },
        ]);

        // Invalid action
        expect(() => {
            helpers.editAffiliationReducer([], {
                type: 'invalid',
            });
        }).toThrow("Unknown action 'invalid'");
    });

    it('createNewAffiliationObject', () => {
        const rowData = { aut_id: 1, aut_display_name: 'Test name' };
        const org = { org_id: 2, org_name: 'Test org name' };
        const id = Date.now();
        expect(helpers.createNewAffiliationObject(rowData, org, id)).toEqual({
            af_author_id: 1,
            af_id: id,
            af_org_id: 2,
            af_status: 1,
            fez_author: {
                aut_display_name: 'Test name',
                aut_id: 1,
            },
            fez_org_structure: {
                org_id: 2,
                org_name: 'Test org name',
            },
        });
        expect(helpers.createNewAffiliationObject(rowData, org)).toEqual(
            expect.objectContaining({
                af_author_id: 1,
                af_org_id: 2,
                af_status: 1,
                fez_author: {
                    aut_display_name: 'Test name',
                    aut_id: 1,
                },
                fez_org_structure: {
                    org_id: 2,
                    org_name: 'Test org name',
                },
            }),
        );
    });
});
