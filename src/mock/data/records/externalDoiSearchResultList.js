import { hydrateMockSearchList } from '../../hydrateMock';

const externalDoiSearchResultList = {
    "total": 1,
    "data": [
        {
            rek_pid: 'UQ:999999',
            rek_title: 'Nutraceuticals and atherosclerosis: human trials.',
            fez_record_search_key_journal_name: 'Cardiovascular therapeutics',
            fez_record_search_key_doi: '10.1111/j.1755-5922.2010.00189.x',
            fez_record_search_key_issn: ['1755-5922'],
            fez_record_search_key_pubmed_id: '20633023',
            fez_record_search_key_issue_number: '4',
            fez_record_search_key_volume_number: '28',
            fez_record_search_key_start_page: '202',
            fez_record_search_key_end_page: '15',
            fez_record_search_key_total_pages: -186,
            fez_record_search_key_language: [false],
            fez_record_search_key_license: null,
            fez_record_search_key_author: [
                {
                    rek_author: 'Badimon, Lina',
                    rek_author_order: 1,
                },
                { rek_author: 'Vilahur, Gemma', rek_author_order: 2 },
                {
                    rek_author: 'Padro, Teresa',
                    rek_author_order: 3,
                },
            ],
            fez_record_search_key_author_affiliation_full_address: [
               'Cardiovascular Research Center, CSIC-ICCC, Hospital de la Santa Creu i Sant Pau and IIB-Santpau, Barcelona, Spain. lbadimon@csic-iccc.org',
            ],
            rek_description:
                'The high prevalence of obesity, atherosclerosis, and cardiovascular disease (CVD) is largely attributable to the contemporary lifestyle that is often sedentary and includes a diet high in saturated fats and sugars and low ingestion polyunsaturated fatty acids (PUFAs), fruit, vegetables, and fiber. Epidemiological studies have confirmed a strong association between fat intake, especially saturated- and transfatty acids, plasma cholesterol levels, and rate of coronary heart disease (CHD) mortality. In counterpart, beneficial cardiovascular effects have been reported in populations consuming the "healthy" Mediterranean-type diet. Indeed, many nutrients and phytochemicals in fruits, vegetables, and wine, including fiber, vitamins, minerals, antioxidants, have shown to be independently or jointly responsible for the apparent reduction in CVD risk. Therefore, in patients with overt CVD, efforts have focused on combining both drug treatments and nutrition interventions. Undoubtedly, the advances in the knowledge of both the disease processes and healthy dietary components have provided new avenues to develop pharmaceutical and/or dietary strategies to halt the development of vascular disease. In this regard, within the last years, pioneering nutritional strategies, such as nutraceuticals, have been developed aimed at reducing the main atherosclerotic risk factors and promoting cardiovascular health. Furthermore, a growing body of clinical evidence has demonstrated positive cardiovascular effects associated with dietary fibers, cholesterol-lowering natural agents, olive oil, omega-3 PUFAs, antioxidants, and polyphenols intake. Moreover, monounsaturated fatty acids intake has shown to modulate the expression of key atherosclerotic-related genes. Yet, in the case of antioxidants, some large clinical trials have failed to confirm such atheroprotective effects. Furthermore, there might be interactions between these natural food supplements and cardiovascular medications that cannot be overlooked. Hence, there is a need for a better understanding and more scientific evidence of the relative contribution of major nutraceutical constituents to the inhibition of the progression of atherosclerosis and its clinical consequences.',
            fez_record_search_key_oa_status: '453698',
            rek_display_type: 179,
            rek_genre: 'Journal Article',
        }
    ]
};
export default hydrateMockSearchList(externalDoiSearchResultList);
