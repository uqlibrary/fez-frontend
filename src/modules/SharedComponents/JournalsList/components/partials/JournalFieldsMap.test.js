import React from 'react';
import { render } from 'test-utils';
import { mockData } from 'mock/data/testing/journals/journalSearchResults';
import JournalFieldsMap from './JournalFieldsMap';

describe('Journal Fields Map', () => {
    it('should show correct information for Journal Title translateFn', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_title')[0];
        expect(testFieldMap.translateFn(testData)).toEqual(testData.jnl_title);
    });

    describe('Open Access indicators', () => {
        const setup = data => {
            const testFieldMap = JournalFieldsMap.filter(map => map.key === 'open_access')[0];
            const indicator = testFieldMap.translateFn(data);

            return render(<>{indicator}</>);
        };

        it('should return expected component for Open Access translateFn', () => {
            const data = { ...mockData.data[0] };
            const { getByText } = setup(data);
            expect(getByText('embargo')).toBeInTheDocument();
        });
    });

    it('should show correct information for Highest Quartile translateFn', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'highest_quartile')[0];
        expect(testFieldMap.translateFn(testData)).toEqual(2);
    });

    it('should also consider quartile data from SSCI (if exists) in highest quartile calculation', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'highest_quartile')[0];
        // Mock record for SSCI.
        testData.fez_journal_jcr_ssci = {
            fez_journal_jcr_ssci_category: [
                {
                    jnl_jcr_ssci_category_quartile: '1',
                },
            ],
        };
        expect(testFieldMap.translateFn(testData)).toEqual(1);
    });

    it('should also consider quartile data from ESCI (if exists) in highest quartile calculation', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'highest_quartile')[0];
        // Mock record for ESCI.
        testData.fez_journal_jcr_esci = {
            fez_journal_jcr_esci_category: [
                {
                    jnl_jcr_esci_category_quartile: 'Q1',
                },
            ],
        };
        expect(testFieldMap.translateFn(testData)).toEqual(1);
    });

    it('should also consider quartile data from AHCI (if exists) in highest quartile calculation', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'highest_quartile')[0];
        // Mock record for AHCI.
        testData.fez_journal_jcr_ahci = {
            fez_journal_jcr_ahci_category: [
                {
                    jnl_jcr_ahci_category_quartile: 'Q1',
                },
            ],
        };
        expect(testFieldMap.translateFn(testData)).toEqual(1);
    });

    it('should return no highest quartile information if none is available', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'highest_quartile')[0];
        // removal of data used to calculate quartile information
        testData.fez_journal_jcr_ssci = undefined;
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap.translateFn(testData)).toEqual(null);
    });

    it('should show correct information for CiteScore translateFn', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_cite_score')[0];
        if (testData.fez_journal_cite_score && testData.fez_journal_cite_score.jnl_cite_score) {
            expect(testFieldMap.translateFn(testData)).toEqual(testData.fez_journal_cite_score.jnl_cite_score);
        }
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap.translateFn(testData)).toEqual('');
    });

    it('should show correct information for CiteScore percentile translateFn', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'fez_journal_cite_score')[0];
        let label = testData.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(item => {
            return `${item.jnl_cite_score_asjc_code_percentile} - ${item.jnl_cite_score_asjc_code_lookup.replace(
                /[0-9]/g,
                '',
            )}`;
        });
        label = label.join(', ');
        expect(testFieldMap.translateFn(testData)).toEqual(label);
        expect(testFieldMap.toolTipLabel(testData)).toEqual(label);
    });
    it('should return no CiteScore Percentile if none available', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'fez_journal_cite_score')[0];
        // remove data used to calculate CiteScore Percentile
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap.translateFn(testData)).toEqual(undefined);
        expect(testFieldMap.toolTipLabel(testData)).toEqual(undefined);
    });

    it('should show correct information for Impact factor translateFn', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_jcr_scie_impact_factor')[0];
        if (testData.fez_journal_jcr_scie && testData.fez_journal_jcr_scie.jnl_jcr_scie_impact_factor) {
            expect(testFieldMap.translateFn(testData)).toEqual(
                testData.fez_journal_jcr_scie.jnl_jcr_scie_impact_factor,
            );
        } else {
            if (testData.fez_journal_jcr_ssci && testData.fez_journal_jcr_ssci.jnl_jcr_ssci_impact_factor) {
                expect(testFieldMap.translateFn(testData)).toEqual(
                    testData.fez_journal_jcr_ssci.jnl_jcr_ssci_impact_factor,
                );
            } else {
                expect(testFieldMap.translateFn(testData)).toEqual(null);
            }
        }
    });
    it('should Calculate impact factor from SSCI if no SCIE, or return NULL if neither', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_jcr_scie_impact_factor')[0];
        // calculate based on ssci
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_jcr_ssci = {
            jnl_jcr_ssci_impact_factor: 10,
        };
        expect(testFieldMap.translateFn(testData)).toEqual(10);
        // calculate based on scie
        testData.fez_journal_jcr_ssci = undefined;
        testData.fez_journal_jcr_scie = {
            jnl_jcr_scie_impact_factor: 5,
        };
        expect(testFieldMap.translateFn(testData)).toEqual(5);
        // no factors to calclate - expect null
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_jcr_ssci = undefined;
        expect(testFieldMap.translateFn(testData)).toEqual(null);
    });
    it('should calculate impact factor tooltip and translateFn from ssci if no scie, or undefined if neither', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_jcr_scie_category_jif_percentile')[0];
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
        expect(testFieldMap.toolTipLabel(testData)).toEqual('1 - test');
        expect(testFieldMap.translateFn(testData)).toEqual('1 - test');
        // check for undefined return.
        testData.fez_journal_jcr_scie = undefined;
        testData.fez_journal_jcr_ssci = undefined;
        expect(testFieldMap.toolTipLabel(testData)).toEqual(undefined);
        expect(testFieldMap.translateFn(testData)).toEqual(undefined);
    });

    it('should show correct information for Impact factor percentile translateFn and toolTipLabel', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_jcr_scie_category_jif_percentile')[0];
        let label = undefined;
        label = testData.fez_journal_jcr_scie.fez_journal_jcr_scie_category.map(item => {
            return `${item.jnl_jcr_scie_category_jif_percentile} - ${item.jnl_jcr_scie_category_description_lookup}`;
        });
        label = label.join(', ');
        expect(testFieldMap.translateFn(testData)).toEqual(label);
        expect(testFieldMap.toolTipLabel(testData)).toEqual(label);
    });

    it('should show correct information for SNIP translateFn', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_cite_score_snip')[0];
        expect(testFieldMap.translateFn(testData)).toEqual(testData.fez_journal_cite_score.jnl_cite_score_snip);
        // check for null return
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap.translateFn(testData)).toEqual(null);
    });

    it('should show correct information for SJR translateFn', () => {
        const testData = { ...mockData.data[0] };
        const testFieldMap = JournalFieldsMap.filter(map => map.key === 'jnl_cite_score_sjr')[0];
        expect(testFieldMap.translateFn(testData)).toEqual(testData.fez_journal_cite_score.jnl_cite_score_sjr);
        // check for null return
        testData.fez_journal_cite_score = undefined;
        expect(testFieldMap.translateFn(testData)).toEqual(null);
    });
});
