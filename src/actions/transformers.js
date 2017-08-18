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
    const attachments = files.map((item, index) => {
        return {
            rek_file_attachment_name: item.name,
            rek_file_attachment_name_order: initialCount + index + 1,
            // rek_file_attachment_name_date: item.date,
            // rek_file_attachment_name_access_condition_id: item.access_condition_id,
        };
    });
    if (record) {
        return {
            fez_record_search_key_file_attachment_name: [
                ...record.fez_record_search_key_file_attachment_name,
                ...attachments
            ]
        };
    } else {
        return {
            fez_record_search_key_file_attachment_name: [
                ...attachments
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
    return {
        fez_record_search_key_author_id: authors.map(
            (item, index) => (
                item.selected ?
                {
                    rek_author_id: item.authorId,
                    rek_author_id_order: index + 1
                }
                :
                {
                    rek_author_id: null,
                    rek_author_id_order: index + 1
                }
            )
        )
    };
}
