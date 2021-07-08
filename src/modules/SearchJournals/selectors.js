export const getJournalSearchKeywords = state => state.get('journalReducer').journalSearchKeywords;
export const getJournalSearchKeywordsLoading = state => state.get('journalReducer').journalSearchKeywordsLoading;
export const getHasJournalSearchKeywordsError = state => !!state.get('journalReducer').journalSearchKeywordsError;
export const getJournalSearchKeywordsError = state => state.get('journalReducer').journalSearchKeywordsError;
export const getHasAnyKeywordsLoaded = state => {
    const keywords = state.get('journalReducer').journalSearchKeywords;
    return (
        keywords.exactMatch.length > 0 ||
        keywords.titleMatch.length > 0 ||
        keywords.keywordMatch.length > 0 ||
        keywords.subjectMatch.length > 0
    );
};
