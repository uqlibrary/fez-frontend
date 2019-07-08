export const trendingPublicationsConfig = {
    sources: {
        scopus: {
            metricDataPath: {
                count: 'fez_record_search_key_scopus_id.fez_scopus_citations.sc_count',
                difference: 'fez_record_search_key_scopus_id.fez_scopus_citations.sc_3m',
                citation_url: 'fez_record_search_key_scopus_id.fez_scopus_citations.sc_citation_url',
            },
        },
        thomson: {
            metricDataPath: {
                count: 'fez_record_search_key_isi_loc.fez_thomson_citations.tc_count',
                difference: 'fez_record_search_key_isi_loc.fez_thomson_citations.tc_3m',
                citation_url: 'fez_record_search_key_isi_loc.fez_thomson_citations.tc_citation_url',
            },
        },
        altmetric: {
            metricDataPath: {
                count: 'fez_record_search_key_doi.fez_altmetric.as_score',
                difference: 'fez_record_search_key_doi.fez_altmetric.as_3m',
                citation_url: 'fez_record_search_key_doi.fez_altmetric.as_citation_url',
            },
        },
    },
};
