export function claimAttachments(files) {
    if (!files || files.length === 0) return null;
    return {
        attachments: files.map((item) => {
            return {
                access_condition_id: 9, // TODO: update to real value, eg item.access_condition_id,
                file: item.name,
                date: item.date
            };
        })
    };
}

export function recordRekLink(data) {
    if (!data.rek_link) return null;

    return {
        fez_record_search_key_link: [
            {
                rek_link: data.rek_link,
                rek_link_order: 0
            }
        ],
        fez_record_search_key_link_description: [
            {
                rek_link_description: data.rek_link,
                rek_link_description_order: 0
            }
        ]
    };
}

export function recordFileAttachment(files, record) {
    if (!files || files.length === 0) return {};

    // if record already has files, add new files to the end of the list (for patch)
    const initialCount = record && record.fez_record_search_key_file_attachment_name ?
        record.fez_record_search_key_file_attachment_name.length : 0;

    // TODO: Refactor - Implement below using searchKey if possible
    const attachmentNames = files.map((item, index) => {
        return {
            rek_file_attachment_name: item.name,
            rek_file_attachment_name_order: initialCount + index + 1
        };
    });
    const attachmentEmbargoDates = files.map((item, index) => {
        return {
            rek_file_attachment_embargo_date: item.date,
            rek_file_attachment_embargo_date_order: initialCount + index + 1
        };
    });
    const attachmentAccessConditions = files.map((item, index) => {
        return {
            rek_file_attachment_access_condition: item.access_condition_id,
            rek_file_attachment_access_condition_order: initialCount + index + 1
        };
    });
    if (record) {
        return {
            fez_record_search_key_file_attachment_name: [
                ...record.fez_record_search_key_file_attachment_name,
                ...attachmentNames
            ],
            fez_record_search_key_file_attachment_embargo_date: [
                ...record.fez_record_search_key_file_attachment_embargo_date,
                ...attachmentEmbargoDates
            ],
            fez_record_search_key_file_attachment_access_condition: [
                ...record.fez_record_search_key_file_attachment_access_condition,
                ...attachmentAccessConditions
            ]
        };
    } else {
        return {
            fez_record_search_key_file_attachment_name: [
                ...attachmentNames
            ],
            fez_record_search_key_file_attachment_embargo_date: [
                ...attachmentEmbargoDates
            ],
            fez_record_search_key_file_attachment_access_condition: [
                ...attachmentAccessConditions
            ]
        };
    }
}

export function recordAuthors(authors) {
    if (!authors || authors.length === 0) return {};
    return {
        fez_record_search_key_author: authors.map((item, index) => (
            {
                rek_author_id: null,
                rek_author: item.nameAsPublished,
                rek_author_order: index + 1
            }
        ))
    };
}

export function recordAuthorsId(authors) {
    if (!authors || authors.length === 0) return {};
    return {
        fez_record_search_key_author_id: authors.map(
            (item, index) => (
                {
                    rek_author_id: (item.hasOwnProperty('aut_id') && item.aut_id) || (item.hasOwnProperty('authorId') && item.authorId) || null,
                    rek_author_id_order: index + 1
                }
            )
        )
    };
}

export function recordContributors(authors) {
    if (!authors || authors.length === 0) return {};

    return {
        fez_record_search_key_contributor: authors.map((item, index) => (
            {
                rek_contributor_id: null,
                rek_contributor: item.nameAsPublished,
                rek_contributor_order: index + 1
            }
        ))
    };
}

export function recordContributorsId(authors) {
    if (!authors || authors.length === 0) return {};
    return {
        fez_record_search_key_contributor_id: authors.map(
            (item, index) => (
                {
                    rek_contributor_id: (item.hasOwnProperty('aut_id') && item.aut_id) || (item.hasOwnProperty('authorId') && item.authorId) || null,
                    rek_contributor_id_order: index + 1
                }
            )
        )
    };
}
