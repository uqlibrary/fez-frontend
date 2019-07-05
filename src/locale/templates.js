export default {
    issues: {
        fixRecord: ({
            contentIndicators = '',
            comments = '',
            link = '',
            files = '',
        }) => `\
        ${comments ? (`Added comments: ${comments} \n`) : ''}\
        ${link ? (`Added link: ${link} \n`) : ''}\
        ${files ? (`Added files: ${files} \n`) : ''}\
        ${contentIndicators ? (`Selected Content Indicator(s): ${contentIndicators} \n`) : ''}`.trim(),

        claimRecord: ({
            contentIndicators = '',
            comments = '',
        }) => `\
        ${comments ? (`Notes from creator of a claimed record: ${comments} \n`) : ''}\
        ${contentIndicators ? (`Selected Content Indicator(s): ${contentIndicators} \n`) : ''}`.trim(),
    },
};
