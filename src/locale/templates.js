export default {
    issues: {
        fixRecord: ({comments = '', link = '', files = ''}) => `\
        ${comments ? (`Added comments: ${comments} \n`) : ''}\
        ${link ? (`Added link: ${link} \n`) : ''}\
        ${files ? (`Added files: ${files} \n`) : ''}`.trim()
    },
    // incomplete: {
    //     incompleteRecord: ({
    //         rek_formatted_abstract = '',
    //         fez_record_search_key_audience_size = '',
    //         fez_record_search_key_creator_contribution_statement = '',
    //         fez_record_search_key_language = '',
    //         fez_record_search_key_quality_indicator = '',
    //         fez_record_search_key_significance = '',
    //         fez_record_search_key_total_pages = ''
    //     }) => `\
    //     ${comments ? (`Added comments: ${comments} \n`) : ''}\
    //     ${link ? (`Added link: ${link} \n`) : ''}\
    //     ${files ? (`Added files: ${files} \n`) : ''}`.trim()
    // }
};
