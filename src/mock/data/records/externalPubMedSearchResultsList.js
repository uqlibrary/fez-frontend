import { hydrateMockSearchList } from '../../hydrateMock';

const externalPubMedSearchResultsList = {
    "total": 1,
    "data": [{
        rek_pid: 'UQ:123456',
        rek_object_type: 3,
        rek_status: 2,
        rek_title:
            'Perspectives from the society for pediatric research (SPR): Decreased effectiveness of the live attenuated influenza vaccine (LAIV).',
        fez_record_search_key_journal_name: 'Pediatric research',
        fez_record_search_key_doi: '10.1038/pr.2017.239',
        fez_record_search_key_issn: ['1530-0447'],
        fez_record_search_key_pubmed_id: '28945700',
        rek_date: '2017-09-25T00:00:00Z',
        fez_record_search_key_author_affiliation_full_address: [
            'Division of Infectious Diseases, Departments of Pediatrics, Internal Medicine and Immunology, University of Texas Southwestern Medical Center, Dallas, TX.',
            "Division of Infectious Diseases, Global Health Center, Department of Pediatrics, Cincinnati Children's Hospital Medical Center, Cincinnati, OH.",
        ],
        rek_description:
            'Purpose of SPR Perspectives Reviews: Address contemporary scientific issues and controversies by leveraging the expertise of SPR membersIncrease SPR member engagement with the journalPair established and younger SPR members to simultaneously increase interaction between SPR members and create opportunities for mentorship The intranasal Live Attenuated Influenza Vaccine (LAIV), FluMist, has been widely appreciated by pediatricians, parents and children alike for its ease of administration. Concerns regarding lack of effectiveness in recent influenza seasons, however, led to the CDC Advisory Committee on Immunization Practices (ACIP) recommendation to administer inactivated influenza vaccines (IIV), and not LAIV, during the 2016-17 and 2017-18 seasons. Given that data from previous years demonstrated equivalent and even improved efficacy of LAIV compared with IIV, this recent data was surprising, raising many questions about potential mechanisms underlying this change. This review seeks to summarize the history of LAIV studies and ACIP recommendations with a focus on the recent decrease in vaccine effectiveness (VE) and discordant results among studies performed in different countries. Decreased VE for A/H1N1pdm09 viruses represents the most consistent finding across studies, as VE has been low every season these viruses predominated since 2010-11. Potential explanations underlying diminished effectiveness include the hypothesis that prior vaccination, reduced thermostability of A/H1N1pdm09, addition of a fourth virus, or reduced replication fitness of A/H1N1pdm09 strains may have contributed to this phenomenon. Ongoing studies and potential alterations to LAIV formulations provide hope for a return of effective LAIV in future influenza seasons.Pediatric Research accepted article preview online, 25 September 2017. doi:10.1038/pr.2017.239.',
        fez_record_search_key_oa_status: '453698',
        fez_record_search_key_institutional_status:  '453224',
        rek_display_type: 179,
        rek_genre: 'Journal Article',
        rek_pubmed_doc_type: 'Journal Article',
        fez_record_search_key_author: ['Gill, Michelle A', 'Schlaudecker, Elizabeth P'],
        fez_record_search_key_author_id: [
            {
                rek_author_id: 0,
                fez_author: {
                    aut_fname: 'Michelle A',
                    aut_lname: 'Gill',
                    aut_display_name: 'Gill, Michelle A',
                    aut_id: 0,
                },
            },
            {
                rek_author_id: 0,
                fez_author: {
                    aut_fname: 'Elizabeth P',
                    aut_lname: 'Schlaudecker',
                    aut_display_name: 'Schlaudecker, Elizabeth P',
                    aut_id: 0,
                },
            },
        ],
    }]
};
export default hydrateMockSearchList(externalPubMedSearchResultsList);
