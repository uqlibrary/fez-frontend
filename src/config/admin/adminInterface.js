import { PUBLICATION_TYPE_BOOK, PUBLICATION_TYPE_BOOK_CHAPTER, PUBLICATION_TYPE_JOURNAL_ARTICLE } from 'config/general';
import { bookFields, bookChapterFields, journalArticleFields } from './fields';

export default {
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: journalArticleFields,
    [PUBLICATION_TYPE_BOOK]: bookFields,
    [PUBLICATION_TYPE_BOOK_CHAPTER]: bookChapterFields,
};
