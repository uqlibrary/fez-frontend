const getValue = (value) => (
    typeof(value) !== 'undefined' && !!value ? value : null
);

// Authentication
export const SESSION_COOKIE_NAME = 'UQLID';
export const TOKEN_NAME = 'X-Uql-Token';
export const BASE_DN = 'ou=Staff,ou=People,o=The University of Queensland,c=AU';

// URLS - values are set in webpack build
export const API_URL = getValue(process.env.API_URL) || 'https://api.library.uq.edu.au/staging/';
export const APP_URL = getValue(process.env.APP_URL) || 'https://fez-staging.library.uq.edu.au/';

export const AUTH_URL_LOGIN = 'https://auth.library.uq.edu.au/login';
export const AUTH_URL_LOGOUT = 'https://auth.library.uq.edu.au/logout';

export const ORCID_BASE_URL = getValue(process.env.ORCID_URL) || 'http://orcid.org';
export const ORCID_CLIENT_ID = getValue(process.env.ORCID_CLIENT_ID) || '12345XYZ';
// console.log('some general stuff');
export const ORCID_AUTHORIZATION_URL = `${ORCID_BASE_URL}/oauth/authorize`;

// Default values for createNewRecord
export const NEW_RECORD_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 2,
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
export const PUBLICATION_TYPE_REFERENCE_ENTRY = 272;

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
        formComponent: components ? components.ConferenceProceedingsForm : null,
        citationComponent: components ? components.ConferenceProceedingsCitation : null,
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
        citationComponent: components ? components.DataCollectionCitation : null,
        hasFormComponent: false
    },
    {
        id: PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
        name: 'Department Technical Report',
        class: 'Uqlibrary\\FezCore\\Types\\DepartmentTechnicalReport',
        citationComponent: components ? components.DepartmentTechnicalReportCitation : null,
        formComponent: components ? components.DepartmentTechnicalReportForm : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_DESIGN,
        name: 'Design',
        class: 'Uqlibrary\\FezCore\\Types\\Design',
        citationComponent: components ? components.DesignCitation : null,
        formComponent: components ? components.DesignForm : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_DIGILIB_IMAGE,
        name: 'Digilib Image',
        class: 'Uqlibrary\\FezCore\\Types\\DigilibImage',
        citationComponent: components ? components.DigilibImageCitation : null,
        hasFormComponent: false
    },
    {
        id: PUBLICATION_TYPE_IMAGE,
        name: 'Image',
        class: 'Uqlibrary\\FezCore\\Types\\Image',
        citationComponent: components ? components.ImageDocumentCitation : null,
        formComponent: components ? components.ImageDocumentForm : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_JOURNAL,
        name: 'Journal',
        class: 'Uqlibrary\\FezCore\\Types\\Journal',
        citationComponent: components ? components.JournalCitation : null,
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
        formComponent: components ? components.NewspaperArticleForm : null,
        citationComponent: components ? components.NewspaperArticleCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_PATENT,
        name: 'Patent',
        class: 'Uqlibrary\\FezCore\\Types\\Patent',
        formComponent: components ? components.PatentForm : null,
        citationComponent: components ? components.PatentCitation : null,
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
        formComponent: components ? components.ThesisForm : null,
        citationComponent: components ? components.ThesisCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_VIDEO_DOCUMENT,
        name: 'Video Document',
        class: 'Uqlibrary\\FezCore\\Types\\Video',
        formComponent: components ? components.VideoDocumentForm : null,
        citationComponent: components ? components.VideoDocumentCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_WORKING_PAPER,
        name: 'Working Paper',
        class: 'Uqlibrary\\FezCore\\Types\\WorkingPaper',
        formComponent: components ? components.WorkingPaperForm : null,
        citationComponent: components ? components.WorkingPaperCitation : null,
        hasFormComponent: true
    },
    {
        id: PUBLICATION_TYPE_REFERENCE_ENTRY,
        name: 'Reference Entry',
        class: 'Uqlibrary\\FezCore\\Types\\ReferenceEntry',
        citationComponent: components ? components.GenericDocumentCitation : null,
        hasFormComponent: false
    }
];

export const openAccessIdLookup = {
    453693: 'DOI',
    453694: 'Link (no DOI)',
    453695: 'File (Publisher version)',
    453696: 'File (Author post-print)',
    453697: 'Other',
};

export const thesisSubtypes = [
    'B.A. Thesis',
    'B.Sc Thesis',
    'Bachelor\'s Thesis',
    'Higher Doctorate',
    'Honours Thesis',
    'M.A. Thesis',
    'M.Sc Thesis',
    'Master\'s Thesis',
    'MPhil Thesis',
    'Other',
    'PhD Thesis',
    'Professional Doctorate'
];

export const OrgUnitsVocabId = 453703;
export const FieldOfResearchVocabId = 451780;

export const authorIdentifierLinks = {
    linkedUrl: {
        publons: 'https://publons.com/author/',
        scopus: 'http://www.scopus.com/authid/detail.url?authorId=',
        researcher: 'http://www.researcherid.com/rid/',
        google_scholar: 'https://scholar.google.com.au/citations?user=',
        orcid: 'https://orcid.org/'
    },
    notLinkedUrl: {
        publons: 'https://app.library.uq.edu.au/#/id',
        scopus: 'https://app.library.uq.edu.au/#/id',
        researcher: 'https://app.library.uq.edu.au/#/id',
        google_scholar: '/author-identifiers/google-scholar/link/',
        orcid: 'https://app.library.uq.edu.au/#/id',
    }
};
