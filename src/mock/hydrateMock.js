export function hydrateMock(truncatedData) {
    if (!truncatedData.rek_pid) {
        throw Error('missing PID in data ' + JSON.encode(truncatedData));
    }

    Object.keys(truncatedData).forEach(key => {
        const field = truncatedData[key];

        const shortKey = key.replace('fez_record_search_key_', 'rek_');
        let updateKeyWith;
        if (key.startsWith('fez_record_search_key_') && Array.isArray(field) && field.constructor !== Object) {
            const result = [];
            field.forEach((field2, order) => {
                let child;
                if (!!field2[shortKey]) {
                    child = {
                        ...field2,
                        [shortKey]: field2[shortKey],
                    };
                } else {
                    child = field2;
                }
                result.push({
                    [`${shortKey}_id`]: 547492, // any random number
                    [`${shortKey}_pid`]: truncatedData.rek_pid,
                    [`${shortKey}_xsdmf_id`]: null,
                    [`${shortKey}`]: child,
                    [`${shortKey}_order`]: order + 1,
                });
            });
            updateKeyWith = result;
        } else if (key.startsWith('fez_record_search_key_')) {
            updateKeyWith = {
                [`${shortKey}_id`]: 547492, // any random number
                [`${shortKey}_pid`]: truncatedData.rek_pid,
                [`${shortKey}_xsdmf_id`]: null,
                [`${shortKey}`]: field,
                [`${shortKey}_order`]: 1,
            };
        } else if (Array.isArray(field) && field.constructor !== Object) {
            const result = [];
            field.forEach((field2, order) => {
                result.push({
                    ...field2,
                    [`${shortKey}_order`]: order + 1,
                });
            });
            updateKeyWith = result;
        } else {
            updateKeyWith = field;
        }
        truncatedData[key] = updateKeyWith;
    });

    return {
        data: {
            rek_title_xsdmf_id: null,
            rek_description_xsdmf_id: null,
            rek_description: '',
            rek_display_type_xsdmf_id: null,
            rek_display_type: 179,
            rek_status_xsdmf_id: null,
            rek_status: 2,
            rek_date_xsdmf_id: null,
            rek_date: '1970-01-01T00:00:00Z',
            rek_object_type_xsdmf_id: null,
            rek_object_type: 3,
            rek_depositor_xsdmf_id: null,
            rek_depositor: null,
            rek_created_date_xsdmf_id: null,
            rek_created_date: '1970-01-01T00:00:00Z',
            rek_updated_date_xsdmf_id: null,
            rek_updated_date: '1970-01-01T00:00:00Z',
            rek_file_downloads: 0,
            rek_citation: '',
            rek_genre_xsdmf_id: null,
            rek_genre: 'Journal Article',
            rek_genre_type_xsdmf_id: null,
            rek_genre_type: null,
            rek_formatted_title_xsdmf_id: null,
            rek_formatted_title: null,
            rek_formatted_abstract_xsdmf_id: null,
            rek_formatted_abstract: '',
            rek_depositor_affiliation_xsdmf_id: null,
            rek_depositor_affiliation: null,
            rek_thomson_citation_count: null,
            rek_thomson_citation_count_xsdmf_id: null,
            rek_subtype_xsdmf_id: null,
            rek_subtype: '',
            rek_scopus_citation_count: null,
            rek_herdc_notes_xsdmf_id: null,
            rek_scopus_doc_type_xsdmf_id: null,
            rek_scopus_doc_type: null,
            rek_wok_doc_type_xsdmf_id: null,
            rek_wok_doc_type: null,
            rek_pubmed_doc_type_xsdmf_id: null,
            rek_pubmed_doc_type: null,
            rek_security_inherited: 1,
            rek_altmetric_score: null,
            rek_altmetric_score_xsdmf_id: null,
            rek_altmetric_id: null,
            rek_altmetric_id_xsdmf_id: null,
            rek_copyright_xsdmf_id: null,
            rek_copyright: 'off',
            rek_security_policy: 1,
            rek_datastream_policy: null,
            fez_datastream_info: [],
            fez_matched_journals: [],
            rek_display_type_lookup: 'Creative Work',
            rek_pubmed_doc_type_lookup: null,
            rek_object_type_lookup: 'Record',
            rek_scopus_doc_type_lookup: null,
            rek_status_lookup: 'Published',
            rek_wok_doc_type_lookup: 'Abstract of Published Item',
            rek_herdc_notes: null,
            rek_editing_user: null,
            rek_editing_user_lookup: null,
            rek_editing_start_date: null,
            fez_internal_notes: {},
            ...truncatedData,
        },
    };
}
