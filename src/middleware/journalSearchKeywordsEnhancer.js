import * as actions from 'actions/actionTypes';
import { pathConfig } from 'config/pathConfig';

const getExactMatchKeywords = keywordsResponse => {
    const exactMatch =
        !!keywordsResponse.exact &&
        keywordsResponse.exact.map(journal => ({
            keyword: journal.jnl_title,
            title: journal.jnl_title,
            href: pathConfig.journal.view(journal.jnl_id),
        }));

    return exactMatch;
};

const getTitleMatchKeywords = keywordsResponse => {
    const titleMatch = !!keywordsResponse.title && keywordsResponse.title.map(keyword => ({ keyword }));

    return titleMatch;
};

const getKeywordMatchKeywords = keywordsResponse => {
    const keywordMatch = !!keywordsResponse.keyword && keywordsResponse.keyword.map(keyword => ({ keyword }));

    return keywordMatch;
};

const getSubjectMatchKeywords = keywordsResponse => {
    const subjectMatch = !!keywordsResponse.subject && keywordsResponse.subject.map(keyword => ({ ...keyword }));

    return subjectMatch;
};

const getKeywords = keywordsResponse => {
    const exactMatch = getExactMatchKeywords(keywordsResponse);
    const titleMatch = getTitleMatchKeywords(keywordsResponse);
    const keywordMatch = getKeywordMatchKeywords(keywordsResponse);
    const subjectMatch = getSubjectMatchKeywords(keywordsResponse);

    return {
        exactMatch,
        titleMatch,
        keywordMatch,
        subjectMatch,
    };
};

const journalSearchKeywordsEnhancer = () => next => action => {
    if (action.type === actions.JOURNAL_SEARCH_KEYWORDS_LOADED) {
        console.log(action.payload);
        const keywords = getKeywords(action.payload);
        return next({ ...action, payload: keywords });
    }

    return next(action);
};

export default journalSearchKeywordsEnhancer;
