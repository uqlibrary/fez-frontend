import * as actions from 'actions/actionTypes';
import { pathConfig } from 'config/pathConfig';

const getExactMatchKeywords = keywordsResponse => {
    const exactMatch =
        !!keywordsResponse.exactMatch &&
        keywordsResponse.exactMatch.length > 0 &&
        keywordsResponse.exactMatch.map(journal => ({
            keyword: journal.jnl_title,
            title: journal.jnl_title,
            href: pathConfig.journal.view(journal.jnl_jid),
        }));

    return exactMatch || [];
};

const getTitleMatchKeywords = (titleFuzzyMatch, query) => {
    const titleMatchKeywords = query.split(' ').reduce((titleMatches, keywordQuery) => {
        const regexString = `\\w*${keywordQuery}\\w*`;
        const regex = new RegExp(regexString, 'ig');
        const titleMatch =
            !!titleFuzzyMatch &&
            titleFuzzyMatch.length > 0 &&
            titleFuzzyMatch.reduce((matches, journal) => {
                const matchedKeywords = journal.jnl_title.match(regex);
                return (
                    (matchedKeywords && [
                        ...matches,
                        ...matchedKeywords.filter(matched => matched && matched.length > 3),
                    ]) ||
                    []
                );
            }, []);

        return (titleMatch && [...titleMatches, ...titleMatch]) || [];
    }, []);

    return Array.from(new Set(titleMatchKeywords.map(keyword => keyword.toLowerCase())))
        .filter(keyword => !!keyword)
        .map(keyword => ({ keyword }));
};

const getKeywordMatchKeywords = (descriptionFuzzyMatch, query) => {
    const keywordMatchKeywords = query.split(' ').reduce((keywordMatches, keywordQuery) => {
        const regexString = `\\w*${keywordQuery}\\w*`;
        const regex = new RegExp(regexString, 'ig');
        const keywordMatch =
            !!descriptionFuzzyMatch &&
            descriptionFuzzyMatch.length > 0 &&
            descriptionFuzzyMatch.reduce(
                // Loop through each journal
                (matches, journal) =>
                    !!journal && !!journal.fez_journal_issn && journal.fez_journal_issn.length > 0
                        ? [
                              ...matches,
                              ...journal.fez_journal_issn.reduce(
                                  // Loop through each journal issn object
                                  (matchFromEachIssn, issn) => {
                                      if (!!issn.fez_ulrichs && !!issn.fez_ulrichs.ulr_description) {
                                          const matchedKeywords = issn.fez_ulrichs.ulr_description.match(regex);
                                          return (
                                              (matchedKeywords && [
                                                  ...matchFromEachIssn,
                                                  ...matchedKeywords.filter(matched => matched && matched.length > 2),
                                              ]) || [...matchFromEachIssn]
                                          );
                                      } else {
                                          return [...matchFromEachIssn];
                                      }
                                  },
                                  [],
                              ),
                          ]
                        : [...matches],
                [],
            );

        return (keywordMatch && [...keywordMatches, ...keywordMatch]) || [];
    }, []);

    return Array.from(new Set(keywordMatchKeywords.map(keyword => keyword.toLowerCase())))
        .filter(keyword => !!keyword)
        .map(keyword => ({ keyword }));
};

const getSubjectMatchKeywords = subjectFuzzyMatch => {
    const subjectMatch =
        !!subjectFuzzyMatch &&
        subjectFuzzyMatch.length > 0 &&
        subjectFuzzyMatch.map(subject => {
            const sourcesArray = subject.jnl_subject_sources.split(',');
            const combinedSources = sourcesArray.map(source => ({
                name: source.replace(/\s/g, '').toLowerCase(),
            }));
            return {
                keyword: subject.jnl_subject_title,
                cvoId: subject.jnl_subject_cvo_id,
                sources: combinedSources,
            };
        });

    return subjectMatch || [];
};

const getKeywords = (keywordsResponse, query) => {
    const exactMatch = getExactMatchKeywords(keywordsResponse);
    const titleMatch =
        (keywordsResponse.titleFuzzyMatch && getTitleMatchKeywords([...keywordsResponse.titleFuzzyMatch], query)) || [];
    const keywordMatch =
        (keywordsResponse.descriptionFuzzyMatch &&
            getKeywordMatchKeywords([...keywordsResponse.descriptionFuzzyMatch], query)) ||
        [];
    const subjectMatch =
        (keywordsResponse.subjectFuzzyMatch && getSubjectMatchKeywords([...keywordsResponse.subjectFuzzyMatch])) || [];

    return {
        exactMatch,
        titleMatch,
        keywordMatch,
        subjectMatch,
    };
};

const journalSearchKeywordsEnhancer = () => next => action => {
    if (action.type === actions.JOURNAL_SEARCH_KEYWORDS_LOADED) {
        const keywords = getKeywords(action.payload, action.query);
        return next({ ...action, payload: keywords });
    }

    return next(action);
};

export default journalSearchKeywordsEnhancer;
