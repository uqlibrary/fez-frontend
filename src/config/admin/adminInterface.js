import {
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
} from 'config/general';
import { audioFields, bookFields, bookChapterFields, journalArticleFields } from './fields';

export default {
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: journalArticleFields,
    [PUBLICATION_TYPE_AUDIO_DOCUMENT]: audioFields,
    [PUBLICATION_TYPE_BOOK]: bookFields,
    [PUBLICATION_TYPE_BOOK_CHAPTER]: bookChapterFields,
};
