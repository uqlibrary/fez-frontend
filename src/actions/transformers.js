export function claimAttachments(data) {
    if (!data.files || data.files.length === 0) return null;

    return {
        attachments: [
            data.files.map((item) => {
                return {
                    access_condition_id: item.access_condition_id,
                    file: item.file,
                    date: item.date
                };
            })
        ]
    };
}

export function recordRekLink(data) {
    if(!data.rek_link) return null;

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

export function recordFileAttachment(data) {
    if(!data.files || data.files.length === 0) return null;

    // if record already has files, add new files to the end of the list (for patch)
    const initialCount = data.fez_record_search_key_file_attachment_name ?
        data.fez_record_search_key_file_attachment_name.length : 0;

    return {
        fez_record_search_key_file_attachment_name: [
            ...data.fez_record_search_key_file_attachment_name,
            data.files.map((file, index) => {
                return {
                    rek_file_attachment_name: file.name,
                    rek_file_attachment_name_order: initialCount + index + 1
                };
            })
        ]
    };
}
