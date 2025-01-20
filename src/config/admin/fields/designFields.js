import commonFields from './commonFields';
import { NTRO_SUBTYPES } from 'config/general';

export default {
    ...commonFields,
    bibliographic: ({ isLote = false, isDesignNtro = true }) => [
        {
            title: 'Title',
            groups: [['rek_title'], ...(isLote ? [['fez_record_search_key_translated_title']] : [])],
        },
        {
            title: 'Language of work',
            groups: [['languages']],
        },
        {
            title: 'Bibliographic',
            groups: isDesignNtro
                ? [
                      ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                      ['fez_record_search_key_series'],
                      [
                          'fez_record_search_key_start_page',
                          'fez_record_search_key_end_page',
                          'fez_record_search_key_total_pages',
                      ],
                      ['fez_record_search_key_project_name'],
                      ['fez_record_search_key_project_start_date', 'fez_record_search_key_end_date'],
                      ['rek_description'],
                      ['fez_record_search_key_original_format'],
                      ['fez_record_search_key_location'],
                  ]
                : [
                      ['fez_record_search_key_series'],
                      ['rek_date'],
                      ['fez_record_search_key_date_available'],
                      ['fez_record_search_key_job_number'],
                      ['rek_description'],
                      ['fez_record_search_key_type_of_data'],
                      ['fez_record_search_key_acknowledgements'],
                      ['fez_record_search_key_original_format', 'fez_record_search_key_scale'],
                      ['fez_record_search_key_source'],
                      ['fez_record_search_key_rights'],
                      ['fez_record_search_key_location'],
                  ],
        },
        ...(!isDesignNtro
            ? [
                  {
                      title: 'Geographic co-ordinates',
                      groups: [['geoCoordinates']],
                  },
              ]
            : []),
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
        ...(isDesignNtro
            ? [
                  {
                      title: 'Subject',
                      groups: [['subjects']],
                  },
              ]
            : []),
        {
            title: 'Sustainable Development Goal',
            groups: [['fez_record_search_key_sdg_source']],
        },
        {
            title: 'Related publications',
            groups: [['fez_record_search_key_isderivationof']],
        },
    ],
    authors: ({ isDesignNtro = true }) => [
        {
            title: 'Designers',
            groups: [['authors']],
        },
        {
            title: isDesignNtro ? 'Consultants' : 'Contributors',
            groups: [['editors']],
        },
    ],
    admin: (isDesignNtro = true) => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Additional information',
            groups: isDesignNtro
                ? [
                      ['rek_subtype'],
                      [
                          'fez_record_search_key_herdc_code',
                          'fez_record_search_key_herdc_status',
                          'fez_record_search_key_institutional_status',
                      ],
                      ['fez_record_search_key_oa_status', 'contentIndicators'],
                  ]
                : [
                      ['rek_subtype'],
                      ['fez_record_search_key_oa_status', 'fez_record_search_key_oa_status_type'],
                      ['fez_record_search_key_license'],
                  ],
        },
    ],
    ntro: () => [
        {
            title: 'Scale/Significance of work & Creator research statement',
            groups: [['significanceAndContributionStatement']],
        },
        {
            title: 'Quality indicators',
            groups: [['qualityIndicators']],
        },
    ],
};

export const validateDesign = (
    { bibliographicSection: bs, adminSection: as },
    { validationErrorsSummary: summary },
) => {
    const isNtro = !!as && !!as.rek_subtype && !!NTRO_SUBTYPES.includes(!!as.rek_subtype);
    return {
        bibliographicSection: {
            ...((isNtro &&
                !((bs || {}).fez_record_search_key_publisher || {}).rek_publisher && {
                    fez_record_search_key_publisher: {
                        rek_publisher: summary.rek_publisher,
                    },
                }) ||
                {}),
            ...((isNtro &&
                !((bs || {}).fez_record_search_key_place_of_publication || {}).rek_place_of_publication && {
                    fez_record_search_key_place_of_publication: {
                        rek_place_of_publication: summary.rek_place_of_publication,
                    },
                }) ||
                {}),
            ...((isNtro &&
                !((bs || {}).fez_record_search_key_project_start_date || {}).rek_project_start_date && {
                    fez_record_search_key_project_start_date: {
                        rek_project_start_date: summary.rek_project_start_date,
                    },
                }) ||
                {}),
        },
    };
};
