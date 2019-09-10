import {
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_IMAGE,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_VIDEO_DOCUMENT,
} from 'config/general';

import {
    audioFields,
    bookChapterFields,
    bookFields,
    conferencePaperFields,
    imageFields,
    journalArticleFields,
    videoFields,
} from './fields';

export default {
    [PUBLICATION_TYPE_AUDIO_DOCUMENT]: audioFields,
    [PUBLICATION_TYPE_BOOK_CHAPTER]: bookChapterFields,
    [PUBLICATION_TYPE_BOOK]: bookFields,
    [PUBLICATION_TYPE_CONFERENCE_PAPER]: conferencePaperFields,
    [PUBLICATION_TYPE_IMAGE]: imageFields,
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: journalArticleFields,
    [PUBLICATION_TYPE_VIDEO_DOCUMENT]: videoFields,
};
