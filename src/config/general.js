// Authentication
export const SESSION_COOKIE_NAME = 'UQLID';
export const TOKEN_NAME = 'X-Uql-Token';

// URLS
// export const API_URL = process.env.NODE_ENV === 'development' ? 'http://dev-api.library.uq.edu.au:8050/' : 'https://api.library.uq.edu.au/staging/';
export const API_URL = 'https://api.library.uq.edu.au/staging/';
export const AUTH_URL_LOGIN = 'https://auth.library.uq.edu.au/login';
export const AUTH_URL_LOGOUT = 'https://auth.library.uq.edu.au/logout';

// Default values for createNewRecord
export const NEW_RECORD_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 3,
    fez_record_search_key_ismemberof: [
        {rek_ismemberof: 'UQ:218198'}
    ]
};

export const PUBLICATION_TYPE_GENERIC_DOCUMENT = 202;
export const PUBLICATION_TYPE_AUDIO_DOCUMENT = 263;
export const PUBLICATION_TYPE_BOOK = 174;
export const PUBLICATION_TYPE_BOOK_CHAPTER = 177;
export const PUBLICATION_TYPE_CONFERENCE_PAPER = 130;
export const PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS = 197;
export const PUBLICATION_TYPE_CREATIVE_WORK = 313;
export const PUBLICATION_TYPE_DATA_COLLECTION = 371;
export const PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT = 181;
export const PUBLICATION_TYPE_DESIGN = 316;
export const PUBLICATION_TYPE_DIGILIB_IMAGE = 228;
export const PUBLICATION_TYPE_IMAGE = 238;
export const PUBLICATION_TYPE_JOURNAL = 294;
export const PUBLICATION_TYPE_JOURNAL_ARTICLE = 179;
export const PUBLICATION_TYPE_MANUSCRIPT = 374;
export const PUBLICATION_TYPE_NEWSPAPER_ARTICLE = 191;
export const PUBLICATION_TYPE_PATENT = 185;
export const PUBLICATION_TYPE_PREPRINT = 204;
export const PUBLICATION_TYPE_RESEARCH_REPORT = 275;
export const PUBLICATION_TYPE_SEMINAR_PAPER = 189;
export const PUBLICATION_TYPE_THESIS = 187;
export const PUBLICATION_TYPE_VIDEO_DOCUMENT = 310;
export const PUBLICATION_TYPE_WORKING_PAPER = 183;

export const publicationTypes = (components) => [
    {
        id: PUBLICATION_TYPE_GENERIC_DOCUMENT,
        name: 'Generic Document',
        class: 'Uqlibrary\\FezCore\\Types\\Generic',
        formComponent: components ? components.GenericDocumentForm : null,
        citationComponent: components ? components.GenericDocumentCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_AUDIO_DOCUMENT,
        name: 'Audio Document',
        class: 'Uqlibrary\\FezCore\\Types\\Audio',
        formComponent: components ? components.AudioDocumentForm : null,
        citationComponent: components ? components.AudioDocumentCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_BOOK,
        name: 'Book',
        class: 'Uqlibrary\\FezCore\\Types\\Book',
        subtypeVocabId: 453581,
        isFavourite: true,
        formComponent: components ? components.BookForm : null,
        citationComponent: components ? components.BookCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_BOOK_CHAPTER,
        name: 'Book Chapter',
        class: 'Uqlibrary\\FezCore\\Types\\BookChapter',
        subtypeVocabId: 453588,
        isFavourite: true,
        formComponent: components ? components.BookChapterForm : null,
        citationComponent: components ? components.BookChapterCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_CONFERENCE_PAPER,
        name: 'Conference Paper',
        class: 'Uqlibrary\\FezCore\\Types\\ConferencePaper',
        subtypeVocabId: 453596,
        isFavourite: true,
        formComponent: components ? components.ConferencePaperForm : null,
        citationComponent: components ? components.ConferencePaperCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
        name: 'Conference Proceedings',
        class: 'Uqlibrary\\FezCore\\Types\\ConferenceProceedings',
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_CREATIVE_WORK,
        name: 'Creative Work',
        class: 'Uqlibrary\\FezCore\\Types\\CreativeWork',
        citationComponent: components ? components.CreativeWorkCitation : null,
        formComponent: components ? components.CreativeWorkForm : null,
        vocabId: 453594,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_DATA_COLLECTION,
        name: 'Data Collection',
        class: 'Uqlibrary\\FezCore\\Types\\DataCollection',
        hasFormComponent: false
    },
    {
        id: PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
        name: 'Department Technical Report',
        class: 'Uqlibrary\\FezCore\\Types\\DepartmentTechnicalReport',
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_DESIGN,
        name: 'Design',
        class: 'Uqlibrary\\FezCore\\Types\\Design',
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_DIGILIB_IMAGE,
        name: 'Digilib Image',
        class: 'Uqlibrary\\FezCore\\Types\\DigilibImage',
        hasFormComponent: false
    },
    {
        id: PUBLICATION_TYPE_IMAGE,
        name: 'Image',
        class: 'Uqlibrary\\FezCore\\Types\\Image',
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_JOURNAL,
        name: 'Journal',
        class: 'Uqlibrary\\FezCore\\Types\\Journal',
        hasFormComponent: false
    },
    {
        id: PUBLICATION_TYPE_JOURNAL_ARTICLE,
        name: 'Journal Article',
        class: 'Uqlibrary\\FezCore\\Types\\JournalArticle',
        subtypeVocabId: 453573,
        isFavourite: true,
        formComponent: components ? components.JournalArticleForm : null,
        citationComponent: components ? components.JournalArticleCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_MANUSCRIPT,
        name: 'Manuscript',
        class: 'Uqlibrary\\FezCore\\Types\\Manuscript',
        citationComponent: components ? components.ManuscriptCitation : null,
        hasFormComponent: false
    },
    {
        id: PUBLICATION_TYPE_NEWSPAPER_ARTICLE,
        name: 'Newspaper Article',
        class: 'Uqlibrary\\FezCore\\Types\\NewspaperArticle',
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_PATENT,
        name: 'Patent',
        class: 'Uqlibrary\\FezCore\\Types\\Patent',
        formComponent: components ? components.PatentForm : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_PREPRINT,
        name: 'Preprint',
        class: 'Uqlibrary\\FezCore\\Types\\Preprint',
        formComponent: components ? components.PreprintForm : null,
        citationComponent: components ? components.PreprintCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_RESEARCH_REPORT,
        name: 'Research Report',
        class: 'Uqlibrary\\FezCore\\Types\\ResearchReport',
        formComponent: components ? components.ResearchReportForm : null,
        citationComponent: components ? components.ResearchReportCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_SEMINAR_PAPER,
        name: 'Seminar Paper',
        class: 'Uqlibrary\\FezCore\\Types\\SeminarPaper',
        formComponent: components ? components.SeminarPaperForm : null,
        citationComponent: components ? components.SeminarPaperCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_THESIS,
        name: 'Thesis',
        class: 'Uqlibrary\\FezCore\\Types\\Thesis',
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_VIDEO_DOCUMENT,
        name: 'Video Document',
        class: 'Uqlibrary\\FezCore\\Types\\Video',
        formComponent: components ? components.VideoDocumentForm : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_WORKING_PAPER,
        name: 'Working Paper',
        class: 'Uqlibrary\\FezCore\\Types\\WorkingPaper',
        formComponent: components ? components.WorkingPaperForm : null,
        hasFormComponent: true
    }
];

export const openAccessIdLookup = {
    453693: 'DOI',
    453694: 'Link (no DOI)',
    453695: 'File (Publisher version)',
    453696: 'File (Author post-print)',
    453697: 'Other',
};

export const OrgUnitsVocabId = 453703;

