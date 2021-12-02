import { mockData } from '../../../../../mock/data/testing/journals/journalSearchResults';

import { JournalFieldsMap } from './JournalFieldsMap';

describe('Journal Fields Map - single item', () => {
    const testData = mockData.data[0];
    it('should show expected data for each translateFn', () => {
        JournalFieldsMap.map(item => {
            switch (item.key) {
                case 'jnl_title':
                    // Journal Title Mapping
                    expect(item.translateFn(testData)).toEqual(testData.jnl_title);
                    break;
                case 'fez_journal_doaj':
                    // Open Access Mapping
                    expect(item.translateFn(testData).props.style.color).toEqual('#e5e5e5');
                    expect(item.translateFn(testData).props.style.marginTop).toEqual(12);
                    break;
                case '':
                    // Highest Quartile Mapping
                    expect(item.translateFn(testData)).toEqual(2);
                    break;
                case 'jnl_cite_score':
                    // CiteScore
                    if (testData.fez_journal_cite_score && testData.fez_journal_cite_score.jnl_cite_score) {
                        expect(item.translateFn(testData)).toEqual(testData.fez_journal_cite_score.jnl_cite_score);
                    }
                    break;
                case 'fez_journal_cite_score':
                    // CiteScore percentile
                    testData.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(map => {
                        expect(item.translateFn(testData)).toContain(map.jnl_cite_score_asjc_code_percentile);
                        expect(item.translateFn(testData)).toContain('-');
                        expect(item.translateFn(testData)).toContain(
                            map.jnl_cite_score_asjc_code_lookup.replace(/[0-9]/g, ''),
                        );
                    });
                    break;
                case 'jnl_jcr_scie_impact_factor':
                    // Impact factor
                    if (testData.fez_journal_jcr_scie && testData.fez_journal_jcr_scie.jnl_jcr_scie_impact_factor) {
                        expect(item.translateFn(testData)).toEqual(
                            testData.fez_journal_jcr_scie.jnl_jcr_scie_impact_factor,
                        );
                    } else {
                        if (testData.fez_journal_jcr_ssci && testData.fez_journal_jcr_ssci.jnl_jcr_ssci_impact_factor) {
                            expect(item.translateFn(testData)).toEqual(
                                testData.fez_journal_jcr_ssci.jnl_jcr_ssci_impact_factor,
                            );
                        } else {
                            expect(item.translateFn(testData)).toEqual(null);
                        }
                    }
                    break;
                case 'jnl_jcr_scie_category_jif_percentile':
                    // Impact factor percentile
                    testData.fez_journal_jcr_scie.fez_journal_jcr_scie_category.map(map => {
                        expect(item.translateFn(testData)).toContain(map.jnl_jcr_scie_category_jif_percentile);
                        expect(item.translateFn(testData)).toContain('-');
                        expect(item.translateFn(testData)).toContain(map.jnl_jcr_scie_category_description_lookup);
                    });
                    break;
                case 'jnl_cite_score_snip':
                    // SNIP
                    expect(item.translateFn(testData)).toContain(testData.fez_journal_cite_score.jnl_cite_score_snip);
                    break;
                case 'jnl_cite_score_sjr':
                    // SJR
                    expect(item.translateFn(testData)).toContain(testData.fez_journal_cite_score.jnl_cite_score_sjr);
                    break;
                default:
                    break;
            }
        });
    });
    it('should show expected data for each toolTipLabel function', () => {
        const testData = mockData.data[0];
        JournalFieldsMap.map(item => {
            // debug(item.key);
            switch (item.key) {
                case 'fez_journal_doaj':
                    // Open Access Mapping
                    !!testData.fez_journal_doaj
                        ? expect(item.toolTipLabel(testData)).toEqual('Open access available')
                        : expect(item.toolTipLabel(testData)).toEqual('Open access not available');
                    break;
                case '':
                    expect(item.toolTipLabel(testData)).toEqual('Click on a journal title to view all');
                    break;
                case 'fez_journal_cite_score':
                    // CiteScore percentile
                    testData.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(map => {
                        expect(item.toolTipLabel(testData)).toContain(map.jnl_cite_score_asjc_code_percentile);
                        expect(item.toolTipLabel(testData)).toContain('-');
                        expect(item.toolTipLabel(testData)).toContain(
                            map.jnl_cite_score_asjc_code_lookup.replace(/[0-9]/g, ''),
                        );
                    });
                    break;
                case 'jnl_jcr_scie_category_jif_percentile':
                    // Impact factor percentile
                    testData.fez_journal_jcr_scie.fez_journal_jcr_scie_category.map(map => {
                        expect(item.toolTipLabel(testData)).toContain(map.jnl_jcr_scie_category_jif_percentile);
                        expect(item.toolTipLabel(testData)).toContain('-');
                        expect(item.toolTipLabel(testData)).toContain(map.jnl_jcr_scie_category_description_lookup);
                    });
                    break;
                default:
                    break;
            }
        });
    });
    // Additional Tests for code coverage checking.
    it('should show alternative style of icon if open access allowed', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'fez_journal_doaj');
        // Allow open access
        testData.fez_journal_doaj = true;
        expect(testFieldMap[0].translateFn(testData).props.style.color).toEqual('orange');
        expect(testFieldMap[0].toolTipLabel(testData)).toEqual('Open access available');
    });
    it('should also consider quartile data from SSCI if exists', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.label === 'Highest quartile');
        // Mock record for SSCI.
        testData.fez_journal_jcr_ssci = {
            fez_journal_jcr_ssci_category: [
                {
                    jnl_jcr_ssci_category_quartile: '1',
                },
            ],
        };
        expect(testFieldMap[0].translateFn(testData)).toEqual(1);
    });
    it('should return no quartile information if none is available', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.label === 'Highest quartile');
        // removal of data used to calculate quartile information
        testData.fez_journal_jcr_ssci = undefined;
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap[0].translateFn(testData)).toEqual(null);
    });
    it('should return no CiteScore if none available', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_cite_score');
        // remove data used to calculate CiteScore
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap[0].translateFn(testData)).toEqual('');
    });
    it('should return no CiteScore Percentile if none available', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'fez_journal_cite_score');
        // remove data used to calculate CiteScore Percentile
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap[0].translateFn(testData)).toEqual(undefined);
        expect(testFieldMap[0].toolTipLabel(testData)).toEqual(undefined);
    });
    it('should Calculate impact factor from SSCI if no SCIE, or return NULL if neither', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_jcr_scie_impact_factor');
        // calculate based on ssci
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_jcr_ssci = {
            jnl_jcr_ssci_impact_factor: 10,
        };
        expect(testFieldMap[0].translateFn(testData)).toEqual(10);
        // calculate basd on scie
        testData.fez_journal_jcr_ssci = undefined;
        testData.fez_journal_jcr_scie = {
            jnl_jcr_scie_impact_factor: 5,
        };
        expect(testFieldMap[0].translateFn(testData)).toEqual(5);
        // no factors to calclate - expect null
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_jcr_ssci = undefined;
        expect(testFieldMap[0].translateFn(testData)).toEqual(null);
    });
    it('should calculate impact factor tooltip and translateFn from ssci if no scie, or undefined if neither', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_jcr_scie_category_jif_percentile');
        // read from ssci
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_jcr_ssci = {
            fez_journal_jcr_ssci_category: [
                {
                    jnl_jcr_ssci_category_jif_percentile: 1,
                    jnl_jcr_ssci_category_description_lookup: 'test',
                },
            ],
        };
        expect(testFieldMap[0].toolTipLabel(testData)).toEqual('1 - test');
        expect(testFieldMap[0].translateFn(testData)).toEqual('1 - test');
        // none set.
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_jcr_ssci = undefined;
        expect(testFieldMap[0].toolTipLabel(testData)).toEqual(undefined);
        expect(testFieldMap[0].translateFn(testData)).toEqual(undefined);
    });
    it('should return no SNIP data if none available', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_cite_score_snip');
        // remove SNIP data
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap[0].translateFn(testData)).toEqual(null);
    });
    it('should return no SJR data if none available', () => {
        const testData = mockData.data[0];
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_cite_score_sjr');
        // remove SJR data
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap[0].translateFn(testData)).toEqual(null);
    });
});
