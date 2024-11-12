import HTMLReactParser from 'html-react-parser';
import diff from 'microdiff';

// note: dd usage is stripped by WebpackStrip for dist builds
global.dd = (...args) => args.forEach(arg => console.dir.bind(console)(arg, { depth: null }));
global.dc = (...args) => args.forEach(arg => console.log.bind(console)(arg));
global.dj = (...args) => args.forEach(arg => console.log.bind(console)(JSON.stringify(arg)));

/* istanbul ignore next */
const tryCatch = (callback, _default = undefined) => {
    try {
        return callback();
    } catch (e) {
        return _default;
    }
};

export const isDevEnv = () => tryCatch(() => process.env.BRANCH === 'development', false);
export const isJestTest = () => tryCatch(() => !!process.env.JEST_WORKER_ID, false);
/* istanbul ignore next */
export const isCypressTest = () => !!window.Cypress;
/* istanbul ignore next */
export const isTest = () => isJestTest() || isCypressTest();

export const leftJoin = (objArr1, objArr2, key1, key2) => {
    if (!objArr2) {
        return objArr1;
    }
    return objArr1.map(anObj1 => ({
        ...objArr2.find(anObj2 => anObj1[key1] === anObj2[key2]),
        ...anObj1,
    }));
};

export const isString = argument => typeof argument === 'string' || argument instanceof String;

export const stripHtml = html => {
    if (!isString(html)) {
        return '';
    }
    const temporalDivElement = document.createElement('div');
    temporalDivElement.innerHTML = html.replace(/<(?:br|p)[^>]*>/gim, ' ').replace(/\s+/, ' ');
    /* istanbul ignore next */
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
};

export const parseHtmlToJSX = html => {
    return HTMLReactParser(isString(html) ? html : '');
};

export const doesListContainItem = (list, term) => {
    return list.some(sort => (typeof sort === 'object' ? sort.value === term : sort === term));
};

export function hydrateMock(truncatedData) {
    if (!truncatedData.rek_pid) {
        throw new Error('missing PID in data ' + JSON.stringify(truncatedData));
    }

    Object.keys(truncatedData).forEach(key => {
        const field = truncatedData[key];

        const shortKey = key.replace('fez_record_search_key_', 'rek_');
        let updateKeyWith;
        if (key.startsWith('fez_record_search_key_') && Array.isArray(field) && field.constructor !== Object) {
            // eg fez_record_search_key_keywords is an array of keyword objects
            const result = [];
            field.forEach((field2, order) => {
                let newEntry;
                if (!!field2 && field2.hasOwnProperty(shortKey)) {
                    newEntry = {
                        [`${shortKey}_id`]: truncatedData[`rek_${shortKey}_id`] || 547492, // any random number to mock db long unique id
                        [`${shortKey}_pid`]: truncatedData.rek_pid,
                        [`${shortKey}_xsdmf_id`]: null,
                        ...field2,
                        [`${shortKey}_order`]: order + 1,
                    };
                } else {
                    newEntry = {
                        [`${shortKey}_id`]: 345324, // any random number
                        [`${shortKey}_pid`]: truncatedData.rek_pid,
                        [`${shortKey}_xsdmf_id`]: null,
                        [`${shortKey}`]: field2,
                        [`${shortKey}_order`]: order + 1,
                    };
                }
                result.push(newEntry);
            });
            updateKeyWith = result;
        } else if (key.startsWith('fez_record_search_key_')) {
            if (!!field && field.hasOwnProperty(shortKey)) {
                updateKeyWith = {
                    [`${shortKey}_id`]: 6753442, // any random number to mock db long unique id
                    [`${shortKey}_pid`]: truncatedData.rek_pid,
                    [`${shortKey}_xsdmf_id`]: null,
                    ...field,
                };
            } else if (field !== null) {
                updateKeyWith = {
                    [`${shortKey}_id`]: 8967845, // any random number
                    [`${shortKey}_pid`]: truncatedData.rek_pid,
                    [`${shortKey}_xsdmf_id`]: null,
                    [`${shortKey}`]: field,
                };
            }
        } else if (Array.isArray(field) && field.constructor !== Object) {
            // eg fez_datastream_info is an array, but doesnt have the FRSK structure
            const result = [];
            field.forEach(field2 => {
                result.push({
                    ...field2,
                });
            });
            updateKeyWith = result;
        } else {
            // a simple non-FRSK field eg rek_title
            updateKeyWith = field;
        }
        truncatedData[key] = updateKeyWith;
    });

    return {
        rek_title_xsdmf_id: null,
        rek_description_xsdmf_id: null,
        rek_description: '',
        rek_display_type_xsdmf_id: null,
        rek_display_type: 179,
        rek_display_type_lookup: 'Journal Article',
        rek_status_xsdmf_id: null,
        rek_status: 2,
        rek_status_lookup: 'Published',
        rek_date_xsdmf_id: null,
        rek_date: '1970-01-01T00:00:00Z',
        rek_object_type_xsdmf_id: null,
        rek_object_type: 3,
        rek_object_type_lookup: 'Record',
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
        rek_scopus_doc_type_xsdmf_id: null,
        rek_scopus_doc_type: null,
        rek_scopus_doc_type_lookup: null,
        rek_wok_doc_type_xsdmf_id: null,
        rek_wok_doc_type: null,
        rek_wok_doc_type_lookup: '',
        rek_pubmed_doc_type_xsdmf_id: null,
        rek_pubmed_doc_type: null,
        rek_pubmed_doc_type_lookup: null,
        rek_security_inherited: 1,
        rek_altmetric_score: null,
        rek_altmetric_score_xsdmf_id: null,
        rek_altmetric_id: null,
        rek_altmetric_id_xsdmf_id: null,
        rek_copyright_xsdmf_id: null,
        rek_copyright: 'off',
        rek_security_policy: null,
        rek_datastream_policy: null,
        fez_datastream_info: [],
        fez_matched_journals: [],
        rek_editing_user: null,
        rek_editing_user_lookup: null,
        rek_editing_start_date: null,
        fez_internal_notes: {},
        fez_record_search_key_refereed: 0,
        fez_record_search_key_roman_script_journal_name: null,
        fez_record_search_key_roman_script_title: null,
        fez_record_search_key_start_page: null,
        fez_record_search_key_license: null,
        fez_record_search_key_contributor: [],
        fez_record_search_key_contributor_id: [],
        fez_record_search_key_corresponding_country: [],
        fez_record_search_key_corresponding_email: [],
        fez_record_search_key_corresponding_name: [],
        fez_record_search_key_corresponding_organisation: [],
        fez_record_search_key_datastream_policy: null,
        fez_record_search_key_doi: null,
        fez_record_search_key_edition: null,
        fez_record_search_key_end_page: null,
        fez_record_search_key_file_attachment_access_condition: [],
        fez_record_search_key_file_attachment_embargo_date: [],
        fez_record_search_key_grant_acronym: [],
        fez_record_search_key_grant_agency: [],
        fez_record_search_key_grant_agency_id: [],
        fez_record_search_key_grant_agency_type: [],
        fez_record_search_key_grant_id: [],
        fez_record_search_key_grant_text: [],
        fez_record_search_key_grant_type: [],
        fez_record_search_key_isbn: [],
        fez_record_search_key_isderivationof: [],
        fez_record_search_key_isi_loc: null,
        fez_record_search_key_ismn: [],
        fez_record_search_key_isrc: [],
        fez_record_search_key_issn: [],
        fez_record_search_key_issue_number: null,
        fez_record_search_key_keywords: [],
        fez_record_search_key_link: [],
        fez_record_search_key_link_description: [],
        fez_record_search_key_original_format: null,
        fez_record_search_key_possible_author_id: [],
        fez_record_search_key_scopus_id: null,
        fez_record_search_key_series: null,
        fez_record_search_key_subject: [],
        fez_record_search_key_translated_title: null,
        fez_record_search_key_volume_number: null,
        fez_record_search_key_wok_doc_types: [],
        fez_record_search_key_access_conditions: null,
        fez_record_search_key_acknowledgements: null,
        fez_record_search_key_advisory_statement: null,
        fez_record_search_key_alternate_genre: [],
        fez_record_search_key_alternative_title: [],
        fez_record_search_key_ands_collection_type: null,
        fez_record_search_key_architectural_features: [],
        fez_record_search_key_article_number: null,
        fez_record_search_key_assigned_group_id: [],
        fez_record_search_key_assigned_user_id: [],
        fez_record_search_key_author_affiliation_country: [],
        fez_record_search_key_author_role: [],
        fez_record_search_key_book_title: null,
        fez_record_search_key_building_materials: [],
        fez_record_search_key_category: [],
        fez_record_search_key_chapter_number: null,
        fez_record_search_key_condition: [],
        fez_record_search_key_conference_dates: null,
        fez_record_search_key_conference_id: null,
        fez_record_search_key_conference_location: null,
        fez_record_search_key_conference_name: null,
        fez_record_search_key_construction_date: null,
        fez_record_search_key_contact_details_email: [],
        fez_record_search_key_convener: null,
        fez_record_search_key_country_of_issue: null,
        fez_record_search_key_coverage_period: [],
        fez_record_search_key_creator_id: [],
        fez_record_search_key_creator_name: [],
        fez_record_search_key_data_volume: null,
        fez_record_search_key_date_available: null,
        fez_record_search_key_date_photo_taken: null,
        fez_record_search_key_date_recorded: null,
        fez_record_search_key_date_scanned: null,
        fez_record_search_key_end_date: null,
        fez_record_search_key_fields_of_research: [],
        fez_record_search_key_file_attachment_name: [],
        fez_record_search_key_geographic_area: [],
        fez_record_search_key_institutional_status: null,
        fez_record_search_key_job_number: null,
        fez_record_search_key_language_of_book_title: [],
        fez_record_search_key_language_of_journal_name: [],
        fez_record_search_key_language_of_proceedings_title: [],
        fez_record_search_key_language_of_title: [],
        fez_record_search_key_length: null,
        fez_record_search_key_location: [],
        fez_record_search_key_native_script_book_title: null,
        fez_record_search_key_native_script_conference_name: null,
        fez_record_search_key_native_script_journal_name: null,
        fez_record_search_key_native_script_proceedings_title: null,
        fez_record_search_key_native_script_title: null,
        fez_record_search_key_newspaper: null,
        fez_record_search_key_notes: null,
        fez_record_search_key_oa_embargo_days: null,
        fez_record_search_key_oa_notes: null,
        fez_record_search_key_org_name: null,
        fez_record_search_key_org_unit_name: null,
        fez_record_search_key_parent_publication: null,
        fez_record_search_key_patent_number: null,
        fez_record_search_key_period: [],
        fez_record_search_key_place_of_publication: null,
        fez_record_search_key_proceedings_title: null,
        fez_record_search_key_project_description: null,
        fez_record_search_key_project_id: null,
        fez_record_search_key_project_name: null,
        fez_record_search_key_project_start_date: null,
        fez_record_search_key_publisher: null,
        fez_record_search_key_pubmed_id: null,
        fez_record_search_key_related_datasets: null,
        fez_record_search_key_related_publications: null,
        fez_record_search_key_report_number: null,
        fez_record_search_key_retracted: null,
        fez_record_search_key_rights: null,
        fez_record_search_key_roman_script_book_title: null,
        fez_record_search_key_roman_script_conference_name: null,
        fez_record_search_key_roman_script_proceedings_title: null,
        fez_record_search_key_scale: null,
        fez_record_search_key_section: null,
        fez_record_search_key_seo_code: [],
        fez_record_search_key_software_required: [],
        fez_record_search_key_source: null,
        fez_record_search_key_start_date: null,
        fez_record_search_key_author_crossref_authenticated: [],
        fez_record_search_key_author_crossref_orcid: [],
        fez_record_search_key_biosis_id: null,
        fez_record_search_key_journal_name: null,
        fez_record_search_key_language: [],
        fez_record_search_key_oa_status_type: null,
        fez_record_search_key_pubmed_central_id: null,
        fez_record_search_key_total_chapters: null,
        fez_record_search_key_translated_conference_name: null,
        fez_record_search_key_translated_journal_name: null,
        fez_record_search_key_translated_proceedings_title: null,
        fez_record_search_key_zoorec_id: null,
        fez_record_search_key_isdatasetof: [],
        fez_record_search_key_has_related_datasets: [],
        fez_record_search_key_has_derivations: [],
        fez_author_affiliation: [],
        fez_record_search_key_audience_size: null,
        fez_record_search_key_author_affiliation_id: [],
        fez_record_search_key_author_affiliation_full_address: [],
        fez_record_search_key_author_affiliation_name: [],
        fez_record_search_key_author_affiliation_type: [],
        fez_record_search_key_content_indicator: [],
        fez_record_search_key_creator_contribution_statement: [],
        fez_record_search_key_quality_indicator: [],
        fez_record_search_key_significance: [],
        fez_record_search_key_has_datasets: [],
        fez_record_search_key_total_pages: null,
        ...truncatedData,
    };
}

export function hydrateMockSearchList(truncatedSearchlist) {
    return {
        ...truncatedSearchlist,
        // data: !!truncatedSearchlist?.data ? truncatedSearchlist.data.map(d => hydrateMock(d)) : [],
        data: truncatedSearchlist.data.map(d => hydrateMock(d)),
    };
}

/**
 * Only allow 0-9 a-z and hyphen in the id/test id
 *
 * @param id
 * @returns string
 */
export const sanitiseId = (...tokens) =>
    tokens
        .filter(token => !!token)
        .map(token =>
            !token.trim
                ? token
                : token
                      ?.trim()
                      ?.replace(/[^0-9a-z\s-_]+/gi, '')
                      ?.replace(/[-_\s]+/g, '-')
                      ?.toLowerCase(),
        )
        .join('-');

/**
 * Insert line break opportunities into a URL
 */
export const formatUrlTextWithWbrTags = url => {
    // Split the URL into an array to distinguish double slashes from single slashes
    const doubleSlash = url.split('//');

    // Format the strings on either side of double slashes separately
    const formatted = doubleSlash
        .map(
            str =>
                // Insert a word break opportunity after a colon
                str
                    .replace(/(?<after>:)/giu, '$1<wbr>')
                    // Before a single slash, tilde, period, comma, hyphen,
                    // underline, question mark, number sign, or percent symbol
                    .replace(/(?<before>[/~.,\-_?#%])/giu, '<wbr>$1')
                    // Before and after an equals sign or ampersand
                    .replace(/(?<beforeAndAfter>[=&])/giu, '<wbr>$1<wbr>'),
            // Reconnect the strings with word break opportunities after double slashes
        )
        .join('//<wbr>');

    return parseHtmlToJSX(formatted);
};

export const handleKeyboardPressActivate = (key, callbackFn) => {
    key.preventDefault();
    if (
        key.code.toLowerCase() !== 'space' &&
        key.code.toLowerCase() !== 'enter' &&
        key.code.toLowerCase() !== 'numpadenter'
    ) {
        return;
    }

    callbackFn();
};

/**
 * Re-order a given object for a given set of keys, ignoring unexisting keys.
 * @param object
 * @param keys
 * @return {*}
 */
export const reorderObjectKeys = (object, keys) =>
    keys.reduce((newObject, key) => {
        if (object.hasOwnProperty(key)) {
            newObject[key] = object[key];
        }
        return newObject;
    }, {});

/**
 * @param object
 * @return {boolean}
 */
export const isEmptyObject = object =>
    object && typeof object === 'object' ? Object.keys(object)?.length === 0 : false;

/**
 * Get a subset of an object for a given set of keys
 * Returns a new object without given keys. Use inclusive=true for the opposite.
 * @param object
 * @param keys {string[]}
 * @param inclusive {boolean}
 * @return {{}}
 */
export const filterObjectKeys = (object, keys, inclusive = false) =>
    !object || typeof object !== 'object'
        ? {}
        : Object.keys(object).reduce((acc, key) => {
              if ((!inclusive && !keys.includes(key)) || (inclusive && keys.includes(key))) {
                  acc[key] = object[key];
              }
              return acc;
          }, {});

/**
 * Reduce an array of object into a single object.
 * @param objects
 * @return {*}
 */
export const combineObjects = (...objects) =>
    objects.reduce((acc, object) => ({ ...acc, ...(object && typeof object === 'object' ? object : {}) }), {});

/**
 * Uses microdiff.js, which is fast but ignores nested object key ordering.
 * To fix this issue, it uses also JSON.stringify.
 *
 * @param array
 * @param anotherArray
 * @return {boolean}
 */
export const isArrayDeeplyEqual = (array, anotherArray) => {
    return (
        diff(array, anotherArray).length === 0 &&
        diff(anotherArray, array).length === 0 &&
        JSON.stringify(array) === JSON.stringify(anotherArray)
    );
};

/**
 * @param key {string}
 * @return {boolean}
 */
export const isFezRecordRelationKey = key => !!key?.match?.(/^fez_record_search_key_[a-z_]+$/);

/**
 * @param relation {object}
 * @return {boolean}
 */
export const hasAtLeastOneFezRecordField = relation =>
    typeof relation === 'object' && !!Object.keys(relation).find(key => !!key?.match?.(/^rek_[a-z_]+$/));

/**
 * @param record {object}
 * @param key {string}
 * @return {boolean}
 */
export const isFezRecordOneToOneRelation = (record, key) =>
    isFezRecordRelationKey(key) && hasAtLeastOneFezRecordField(record[key]);

/**
 * @param record {object}
 * @param key {string}
 * @return {boolean}
 */
export const isFezRecordOneToManyRelation = (record, key) =>
    isFezRecordRelationKey(key) &&
    record[key] instanceof Array &&
    !!record[key].length &&
    hasAtLeastOneFezRecordField(record[key][0]);
