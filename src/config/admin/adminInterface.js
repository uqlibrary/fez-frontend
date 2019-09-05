import {
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
} from 'config/general';

import { audioFields, bookFields, bookChapterFields, conferencePaperFields, journalArticleFields } from './fields';

export default {
    [PUBLICATION_TYPE_AUDIO_DOCUMENT]: audioFields,
    [PUBLICATION_TYPE_BOOK]: bookFields,
    [PUBLICATION_TYPE_BOOK_CHAPTER]: bookChapterFields,
    [PUBLICATION_TYPE_CONFERENCE_PAPER]: conferencePaperFields,
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: journalArticleFields,
};
