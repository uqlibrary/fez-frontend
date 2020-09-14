export default {
    // the spacing is to improve readability in the resulting email
    issues: {
        fixRecord: ({ contentIndicators = '', comments = '', link = '', files = '' }) =>
            `\
        ${comments ? `Added comments: \n          ${comments} \n\n` : ''}\
        ${link ? `Added link: \n          ${link} \n\n` : ''}\
        ${files ? `Added files: \n          ${files} \n\n` : ''}\
        ${contentIndicators ? `Selected Content Indicator(s): \n          ${contentIndicators} \n` : ''}`.trim(),

        claimRecord: ({ contentIndicators = '', comments = '', link = '', files = '' }) =>
            `\
        ${comments ? `        Notes from creator of a claimed work: \n          ${comments} \n\n` : ''}\
        ${link ? `Added link: \n          ${link} \n\n` : ''}\
        ${files ? `Added files: \n          ${files} \n\n` : ''}\
        ${contentIndicators ? `Selected Content Indicator(s): \n          ${contentIndicators} \n` : ''}`.trim(),
    },
};
