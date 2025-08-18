import React from 'react';
import JournalName, { getERAYears, getSherpaRomeo } from './JournalName';
import { journalArticle } from 'mock/data/testing/records';
import { sanitiseData } from 'actions/records';
import { render, WithRouter } from 'test-utils';

let testJournalArticle = sanitiseData(journalArticle);

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || testJournalArticle,
    };

    return render(
        <WithRouter>
            <JournalName {...props} />
        </WithRouter>,
    );
}

describe('Journal Name Component test ', () => {
    beforeEach(() => {
        // Clone from original mock data before each test
        testJournalArticle = sanitiseData(journalArticle);
    });

    it('should render with journal article', () => {
        const { container, getByTestId } = setup();
        expect(getByTestId('era-year-listed')).toHaveTextContent('(ERA 2010 Journal(s) Listed)');
        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with empty props', () => {
        const { container } = setup({ publication: {} });
        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render without era journal listed', () => {
        delete testJournalArticle.fez_matched_journals.fez_journal;
        const { container, queryByTestId } = setup();
        expect(queryByTestId('era-year-listed')).toBeNull();
        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with deduped era years', () => {
        testJournalArticle.fez_matched_journals.fez_journal = {
            fez_journal_era: [
                {
                    jni_id: 13071,
                    jnl_era_source_year: 2001,
                },
                {
                    jni_id: 13072,
                    jnl_era_source_year: 2001,
                },
            ],
        };
        const { getByTestId } = setup();
        expect(getByTestId('era-year-listed')).toHaveTextContent('(ERA 2001 Journal(s) Listed)');
    });

    it('should render with multiple era years', () => {
        testJournalArticle.fez_matched_journals.fez_journal = {
            fez_journal_era: [
                {
                    jni_id: 13071,
                    jnl_era_source_year: 2001,
                },
                {
                    jni_id: 13072,
                    jnl_era_source_year: 2002,
                },
            ],
        };
        const { getByTestId } = setup();
        expect(getByTestId('era-year-listed')).toHaveTextContent('(ERA 2001, 2002 Journal(s) Listed)');
    });

    it('should render without matched journals', () => {
        testJournalArticle.fez_matched_journals.fez_journal = [];
        const { queryByTestId } = setup();
        expect(queryByTestId('era-year-listed')).toBeNull();
    });

    it('should render without sherpa romeo', () => {
        delete testJournalArticle.fez_record_search_key_issn[0].rek_issn_lookup;
        delete testJournalArticle.fez_record_search_key_issn[0].fez_sherpa_romeo;

        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();
    });

    describe('getERAYears', () => {
        it('should return expected results', () => {
            expect(getERAYears({})).toEqual([]);
            expect(getERAYears({ fez_journal: {} })).toEqual([]);
            expect(getERAYears({ fez_journal: { fez_journal_era: [] } })).toEqual([]);

            expect(
                getERAYears({
                    fez_journal: {
                        fez_journal_era: [
                            {
                                jni_id: 13071,
                            },
                            {
                                jni_id: 13072,
                            },
                        ],
                    },
                }),
            ).toEqual([]);

            expect(
                getERAYears({
                    fez_journal: {
                        fez_journal_era: [
                            {
                                jni_id: 13071,
                                jnl_era_source_year: 2001,
                            },
                            {
                                jni_id: 13072,
                                jnl_era_source_year: 2001,
                            },
                        ],
                    },
                }),
            ).toEqual([2001]);

            expect(
                getERAYears({
                    fez_journal: {
                        fez_journal_era: [
                            {
                                jni_id: 13071,
                            },
                            {
                                jni_id: 13072,
                                jnl_era_source_year: 2002,
                            },
                        ],
                    },
                }),
            ).toEqual([2002]);

            expect(
                getERAYears({
                    fez_journal: {
                        fez_journal_era: [
                            {
                                jni_id: 13071,
                                jnl_era_source_year: 2001,
                            },
                            {
                                jni_id: 13072,
                                jnl_era_source_year: 2002,
                            },
                        ],
                    },
                }),
            ).toEqual([2001, 2002]);
        });
    });
    describe('getSherpaRomeo', () => {
        it('should return expected results', () => {
            expect(getSherpaRomeo([])).toBeNull();
            expect(
                getSherpaRomeo([
                    {
                        rek_issn: '1532-1827',
                        fez_sherpa_romeonope: {
                            srm_journal_link: 'https://v2.sherpa.ac.uk/id/publication/1627',
                        },
                    },
                ]),
            ).toBeNull();

            expect(
                getSherpaRomeo([
                    {
                        rek_issn: '1532-1827',
                        fez_sherpa_romeo: {
                            srm_journal_link_nope: 'https://v2.sherpa.ac.uk/id/publication/1627',
                        },
                    },
                ]),
            ).toBeNull();

            expect(
                getSherpaRomeo([
                    {
                        rek_issn: '1532-1827',
                        fez_sherpa_romeonope: {
                            srm_journal_link: 'https://v2.sherpa.ac.uk/id/publication/1627',
                        },
                    },
                    {
                        rek_issn: '1532-1827',
                        fez_sherpa_romeo: {
                            srm_journal_link: 'https://v2.sherpa.ac.uk/id/publication/1627',
                        },
                    },
                ]),
            ).toEqual({ issn: '1532-1827', url: 'https://v2.sherpa.ac.uk/id/publication/1627' });

            expect(
                getSherpaRomeo([
                    {
                        rek_issn: '1532-1827',
                        fez_sherpa_romeo: {
                            srm_journal_link_nope: 'https://v2.sherpa.ac.uk/id/publication/1627',
                        },
                    },
                    {
                        rek_issn: '1532-1827',
                        fez_sherpa_romeo: {
                            srm_journal_link: 'https://v2.sherpa.ac.uk/id/publication/1627',
                        },
                    },
                ]),
            ).toEqual({ issn: '1532-1827', url: 'https://v2.sherpa.ac.uk/id/publication/1627' });

            expect(
                getSherpaRomeo([
                    {
                        rek_issn: '1532-1827',
                        fez_sherpa_romeo: {
                            srm_journal_link: 'https://v2.sherpa.ac.uk/id/publication/1627',
                        },
                    },
                ]),
            ).toEqual({ issn: '1532-1827', url: 'https://v2.sherpa.ac.uk/id/publication/1627' });

            expect(
                getSherpaRomeo([
                    {
                        rek_issn: '1532-1827',
                        fez_sherpa_romeo: {
                            srm_journal_link: 'https://v2.sherpa.ac.uk/id/publication/1627',
                        },
                    },
                    {
                        rek_issn: '1532-0000',
                        fez_sherpa_romeo: {
                            srm_journal_link: 'https://v2.sherpa.ac.uk/id/publication/0000',
                        },
                    },
                ]),
            ).toEqual({ issn: '1532-1827', url: 'https://v2.sherpa.ac.uk/id/publication/1627' });
        });
    });
});
