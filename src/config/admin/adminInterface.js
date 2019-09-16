import {
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_IMAGE,
    PUBLICATION_TYPE_JOURNAL,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_MANUSCRIPT,
    PUBLICATION_TYPE_VIDEO_DOCUMENT,
    PUBLICATION_TYPE_WORKING_PAPER,
} from 'config/general';

import {
    audioFields,
    bookChapterFields,
    bookFields,
    conferencePaperFields,
    imageFields,
    journalFields,
    journalArticleFields,
    manuscriptFields,
    videoFields,
    workingPaperFields,
} from './fields';

export default {
    [PUBLICATION_TYPE_AUDIO_DOCUMENT]: audioFields,
    [PUBLICATION_TYPE_BOOK_CHAPTER]: bookChapterFields,
    [PUBLICATION_TYPE_BOOK]: bookFields,
    [PUBLICATION_TYPE_CONFERENCE_PAPER]: conferencePaperFields,
    [PUBLICATION_TYPE_IMAGE]: imageFields,
    [PUBLICATION_TYPE_JOURNAL]: journalFields,
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: journalArticleFields,
    [PUBLICATION_TYPE_MANUSCRIPT]: manuscriptFields,
    [PUBLICATION_TYPE_VIDEO_DOCUMENT]: videoFields,
    [PUBLICATION_TYPE_WORKING_PAPER]: workingPaperFields,
};
