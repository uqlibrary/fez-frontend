import moment from 'moment';

const converter = require('number-to-words');

const getKeyValue = value => (process.env.NODE_ENV === 'production' ? `?key=${value}&` : '?');

export const RESOLVER_URL_PREFIX = 'https://resolver.library.uq.edu.au/openathens/redir?qurl=';

export const ULRICHS_URL_PREFIX =
    RESOLVER_URL_PREFIX + encodeURIComponent('https://ulrichsweb.serialssolutions.com/title/');

export const prefixByUrlResolver = url => RESOLVER_URL_PREFIX + encodeURIComponent(url);

export const getDoajUrl = issn => prefixByUrlResolver(`https://doaj.org/toc/${issn}`);

export const numberToWords = value => {
    const ordinal = converter.toWordsOrdinal(value);
    return ordinal.charAt(0).toUpperCase() + ordinal.slice(1);
};

// Authentication
export const SESSION_COOKIE_NAME = 'UQLID';
export const PRE_MASQUERADE_SESSION_COOKIE_NAME = 'UQLID_PREMASQUERADE'; // value must match reusable - name of cookie the pre-masquerade session token is stored in while masquerading
export const SESSION_USER_GROUP_COOKIE_NAME = 'UQLID_USER_GROUP';
export const TOKEN_NAME = 'X-Uql-Token';
export const GENERIC_DATE_FORMAT = 'DD/MM/YYYY';
export const UQ_FULL_NAME = 'The University of Queensland';

export const IS_JEST_TEST = !!process.env.JEST_WORKER_ID;
export const IS_PLAYWRIGHT_TEST = !!process.env.PW_IS_RUNNING;
export const IS_TEST = IS_JEST_TEST || IS_PLAYWRIGHT_TEST;

// URLS
export const LOCALHOST_DOMAIN = 'localhost';
export const LOCALHOST_ALIAS_DOMAIN = 'dev-espace.library.uq.edu.au';
export const LOCALHOST_URL = `http://${LOCALHOST_DOMAIN}/`;
export const PRODTEST_URL = 'https://fez-testing.library.uq.edu.au/';
export const PRODUCTION_URL = 'https://espace.library.uq.edu.au/';
export const STAGING_URL = 'https://fez-staging.library.uq.edu.au/';
export const DEVELOPMENT_BRANCH_URL = 'https://development.library.uq.edu.au/';
export const PRODUCTION_API_URL = 'https://api.library.uq.edu.au/v1/';
export const STAGING_API_URL = 'https://api.library.uq.edu.au/staging/';
export const API_URL = process.env.API_URL || STAGING_API_URL;
export const APP_URL = process.env.APP_URL || LOCALHOST_URL;
export const IS_PRODUCTION = APP_URL.includes(PRODUCTION_URL) || APP_URL.includes(PRODTEST_URL);
export const IS_LOCAL_DEV = APP_URL.includes(LOCALHOST_DOMAIN) || APP_URL.includes(LOCALHOST_ALIAS_DOMAIN);
export const IS_DEVELOPMENT_BRANCH = APP_URL.includes(DEVELOPMENT_BRANCH_URL);

export const AUTH_URL_LOGIN = process.env.AUTH_LOGIN_URL || `${APP_URL}login`;
export const AUTH_URL_LOGOUT = process.env.AUTH_LOGOUT_URL || 'https://auth.library.uq.edu.au/logout';

export const FEZ_USER_SYSTEM_ID = 41783;
export const FEZ_USER_SYSTEM_USERNAME = 'webcron';
export const FEZ_USER_SYSTEM_LABEL = 'System';

export const ORCID_BASE_URL = process.env.ORCID_URL || 'https://orcid.org';
export const ORCID_CLIENT_ID = process.env.ORCID_CLIENT_ID || '12345XYZ';
export const ORCID_AUTHORIZATION_URL = `${ORCID_BASE_URL}/oauth/authorize`;
export const DASHBOARD_HIDE_ORCID_SYNC_DIALOG_COOKIE = 'dashboard-hide-orcid-sync-dialog';

export const ROR_BASE_URL = 'https://ror.org';

export const RAID_BASE_URL = 'https://raid.org';

export const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js${getKeyValue(
    process.env.GOOGLE_MAPS_API_KEY,
)}v=3.exp&libraries=geometry,drawing,places`;
export const GOOGLE_MAPS_API_CHINA_URL = `http://maps.google.cn/maps/api/js${getKeyValue(
    process.env.GOOGLE_MAPS_API_KEY,
)}v=3.exp&libraries=geometry,drawing,places`;

// convenience method to return an image via require() with a leading / where necessary
export const getRequiredImagePath = imagePath => `${!IS_LOCAL_DEV && !IS_DEVELOPMENT_BRANCH ? '/' : ''}${imagePath}`;

// these values must match what is in api at fez_core/src/config/fez_core.php
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
export const PUBLICATION_TYPE_GENERIC_DOCUMENT = 202;
export const PUBLICATION_TYPE_IMAGE = 238;
export const PUBLICATION_TYPE_INSTRUMENT = 378;
export const PUBLICATION_TYPE_JOURNAL = 294;
export const PUBLICATION_TYPE_JOURNAL_ARTICLE = 179;
export const PUBLICATION_TYPE_MANUSCRIPT = 374;
export const PUBLICATION_TYPE_NEWSPAPER_ARTICLE = 191;
export const PUBLICATION_TYPE_PATENT = 185;
export const PUBLICATION_TYPE_PREPRINT = 204;
export const PUBLICATION_TYPE_REFERENCE_ENTRY = 272;
export const PUBLICATION_TYPE_RESEARCH_REPORT = 275;
export const PUBLICATION_TYPE_SEMINAR_PAPER = 189;
export const PUBLICATION_TYPE_THESIS = 187;
export const PUBLICATION_TYPE_VIDEO_DOCUMENT = 310;
export const PUBLICATION_TYPE_WORKING_PAPER = 183;

export const PUBLICATION_TYPE_DESIGN_CW_ARCHITECTURAL_WORK = 1003;
export const PUBLICATION_TYPE_CW_TEXTUAL_WORK_BOOK = 1004;
export const PUBLICATION_TYPE_CW_TEXTUAL_WORK_BOOK_CHAPTER = 1005;
export const PUBLICATION_TYPE_CW_TEXTUAL_WORK_JOURNAL_ARTICLE = 1006;
export const PUBLICATION_TYPE_CW_TEXTUAL_WORK_CREATIVE_WORK = 1007;
export const PUBLICATION_TYPE_CW_VISUAL_WORK_CREATIVE_WORK = 1011;
export const PUBLICATION_TYPE_CW_MUSICAL_COMPOSITION_CREATIVE_WORK = 1015;
export const PUBLICATION_TYPE_CW_OTHER_CREATIVE_WORK = 1019;
export const PUBLICATION_TYPE_LP_MUSIC = 1020;
export const PUBLICATION_TYPE_LP_DANCE = 1021;
export const PUBLICATION_TYPE_LP_PLAYS_DRAMAS_THEATRE = 1022;
export const PUBLICATION_TYPE_LP_INTERARTS = 1023;
export const PUBLICATION_TYPE_LP_OTHER = 1024;
export const PUBLICATION_TYPE_RRW_MUSIC_DANCE_THEATRE = 1025;
export const PUBLICATION_TYPE_RRW_AUDIO_VISUAL_RECORDING = 1026;
export const PUBLICATION_TYPE_RRW_DIGITAL_CREATIVE_WORKS = 1027;
export const PUBLICATION_TYPE_RRW_INTERARTS = 1028;
export const PUBLICATION_TYPE_RRW_WEBSITE_EXHIBITION = 1029;
export const PUBLICATION_TYPE_RRW_OTHER = 1030;
export const PUBLICATION_TYPE_CPEE_EXHIBITION_EVENT = 1031;
export const PUBLICATION_TYPE_CPEE_FESTIVAL = 1032;
export const PUBLICATION_TYPE_CPEE_WEB_BASED_EXHIBITION = 1033;
export const PUBLICATION_TYPE_CPEE_OTHER = 1034;
export const PUBLICATION_TYPE_RREB_PUBLIC_SECTOR = 1035;
export const PUBLICATION_TYPE_RREB_INDUSTRY = 1036;
export const PUBLICATION_TYPE_RREB_NOT_FOR_PROFIT = 1037;
export const PUBLICATION_TYPE_RREB_OTHER = 1038;
export const PUBLICATION_TYPE_RR_INTERNAL_OTHER = 1039;

export const DOCUMENT_TYPE_AUDIO_DOCUMENT = 'Audio Document';
export const DOCUMENT_TYPE_BOOK = 'Book';
export const DOCUMENT_TYPE_BOOK_CHAPTER = 'Book Chapter';
export const DOCUMENT_TYPE_CONFERENCE_PAPER = 'Conference Paper';
export const DOCUMENT_TYPE_CONFERENCE_PROCEEDINGS = 'Conference Proceedings';
export const DOCUMENT_TYPE_CREATIVE_WORK = 'Creative Work';
export const DOCUMENT_TYPE_DATA_COLLECTION = 'Data Collection';
export const DOCUMENT_TYPE_DEPARTMENT_TECHNICAL_REPORT = 'Department Technical Report';
export const DOCUMENT_TYPE_DESIGN = 'Design';
export const DOCUMENT_TYPE_DIGILIB_IMAGE = 'Digilib Image';
export const DOCUMENT_TYPE_GENERIC_DOCUMENT = 'Generic Document';
export const DOCUMENT_TYPE_IMAGE = 'Image';
export const DOCUMENT_TYPE_INSTRUMENT = 'Instrument';
export const DOCUMENT_TYPE_JOURNAL = 'Journal';
export const DOCUMENT_TYPE_JOURNAL_ARTICLE = 'Journal Article';
export const DOCUMENT_TYPE_MANUSCRIPT = 'Manuscript';
export const DOCUMENT_TYPE_NEWSPAPER_ARTICLE = 'Newspaper Article';
export const DOCUMENT_TYPE_PATENT = 'Patent';
export const DOCUMENT_TYPE_PREPRINT = 'Preprint';
export const DOCUMENT_TYPE_REFERENCE_ENTRY = 'Reference Entry';
export const DOCUMENT_TYPE_RESEARCH_REPORT = 'Research Report';
export const DOCUMENT_TYPE_SEMINAR_PAPER = 'Seminar Paper';
export const DOCUMENT_TYPE_THESIS = 'Thesis';
export const DOCUMENT_TYPE_VIDEO_DOCUMENT = 'Video Document';
export const DOCUMENT_TYPE_WORKING_PAPER = 'Working Paper';

export const DOCUMENT_TYPES_EDIT_ONLY = [PUBLICATION_TYPE_REFERENCE_ENTRY];

export const PUBLICATION_TYPES_WITH_DOI = [
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
    PUBLICATION_TYPE_INSTRUMENT,
    PUBLICATION_TYPE_JOURNAL,
    PUBLICATION_TYPE_RESEARCH_REPORT,
    PUBLICATION_TYPE_THESIS,
    PUBLICATION_TYPE_WORKING_PAPER,
];

export const CSV_INGEST_DOCUMENT_TYPES = [
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_DIGILIB_IMAGE,
    PUBLICATION_TYPE_DESIGN,
    PUBLICATION_TYPE_IMAGE,
    PUBLICATION_TYPE_INSTRUMENT,
    PUBLICATION_TYPE_JOURNAL,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_MANUSCRIPT,
    PUBLICATION_TYPE_THESIS,
    PUBLICATION_TYPE_VIDEO_DOCUMENT,
];

export const DOCUMENT_TYPES_LOOKUP = {
    [PUBLICATION_TYPE_AUDIO_DOCUMENT]: DOCUMENT_TYPE_AUDIO_DOCUMENT,
    [PUBLICATION_TYPE_BOOK]: DOCUMENT_TYPE_BOOK,
    [PUBLICATION_TYPE_BOOK_CHAPTER]: DOCUMENT_TYPE_BOOK_CHAPTER,
    [PUBLICATION_TYPE_CONFERENCE_PAPER]: DOCUMENT_TYPE_CONFERENCE_PAPER,
    [PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS]: DOCUMENT_TYPE_CONFERENCE_PROCEEDINGS,
    [PUBLICATION_TYPE_CREATIVE_WORK]: DOCUMENT_TYPE_CREATIVE_WORK,
    [PUBLICATION_TYPE_DATA_COLLECTION]: DOCUMENT_TYPE_DATA_COLLECTION,
    [PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT]: DOCUMENT_TYPE_DEPARTMENT_TECHNICAL_REPORT,
    [PUBLICATION_TYPE_DESIGN]: DOCUMENT_TYPE_DESIGN,
    [PUBLICATION_TYPE_DIGILIB_IMAGE]: DOCUMENT_TYPE_DIGILIB_IMAGE,
    [PUBLICATION_TYPE_GENERIC_DOCUMENT]: DOCUMENT_TYPE_GENERIC_DOCUMENT,
    [PUBLICATION_TYPE_IMAGE]: DOCUMENT_TYPE_IMAGE,
    [PUBLICATION_TYPE_INSTRUMENT]: DOCUMENT_TYPE_INSTRUMENT,
    [PUBLICATION_TYPE_JOURNAL]: DOCUMENT_TYPE_JOURNAL,
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: DOCUMENT_TYPE_JOURNAL_ARTICLE,
    [PUBLICATION_TYPE_MANUSCRIPT]: DOCUMENT_TYPE_MANUSCRIPT,
    [PUBLICATION_TYPE_NEWSPAPER_ARTICLE]: DOCUMENT_TYPE_NEWSPAPER_ARTICLE,
    [PUBLICATION_TYPE_PATENT]: DOCUMENT_TYPE_PATENT,
    [PUBLICATION_TYPE_PREPRINT]: DOCUMENT_TYPE_PREPRINT,
    [PUBLICATION_TYPE_REFERENCE_ENTRY]: DOCUMENT_TYPE_REFERENCE_ENTRY,
    [PUBLICATION_TYPE_RESEARCH_REPORT]: DOCUMENT_TYPE_RESEARCH_REPORT,
    [PUBLICATION_TYPE_SEMINAR_PAPER]: DOCUMENT_TYPE_SEMINAR_PAPER,
    [PUBLICATION_TYPE_THESIS]: DOCUMENT_TYPE_THESIS,
    [PUBLICATION_TYPE_VIDEO_DOCUMENT]: DOCUMENT_TYPE_VIDEO_DOCUMENT,
    [PUBLICATION_TYPE_WORKING_PAPER]: DOCUMENT_TYPE_WORKING_PAPER,
};

export const MAX_PUBLIC_SEARCH_TEXT_LENGTH = 2000;

export const NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK = 'Creative Work - Design/Architectural';
export const NTRO_SUBTYPE_CW_TEXTUAL_WORK = 'Creative Work - Textual';
export const NTRO_SUBTYPE_CW_VISUAL_WORK = 'Creative Work - Visual Art';
export const NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION = 'Creative Work - Musical Composition';
export const NTRO_SUBTYPE_CW_OTHER = 'Creative Work - Other';
export const NTRO_SUBTYPE_LP_MUSIC = 'Live Performance of Creative Work - Music';
export const NTRO_SUBTYPE_LP_DANCE = 'Live Performance of Creative Work - Dance';
export const NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE = 'Live Performance of Creative Work - Plays, Dramas, Theatre';
export const NTRO_SUBTYPE_LP_INTERARTS = 'Live Performance of Creative Work - Interarts';
export const NTRO_SUBTYPE_LP_OTHER = 'Live Performance of Creative Work - Other';
export const NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE = 'Recorded or Rendered Creative Work - Music, Dance, Theatre';
export const NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING = 'Recorded or Rendered Creative Work - Audio or Visual';
export const NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS = 'Recorded or Rendered Creative Work - Digital';
export const NTRO_SUBTYPE_RRW_INTERARTS = 'Recorded or Rendered Creative Work - Interarts';
export const NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION = 'Recorded or Rendered Creative Work - Web Exhibition';
export const NTRO_SUBTYPE_RRW_OTHER = 'Recorded or Rendered Creative Work - Other';
export const NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT = 'Curated or Produced Exhibition or Event - Exhibition or Event';
export const NTRO_SUBTYPE_CPEE_FESTIVAL = 'Curated or Produced Exhibition or Event - Festival';
export const NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION = 'Curated or Produced Exhibition or Event - Web Exhibition';
export const NTRO_SUBTYPE_CPEE_OTHER = 'Curated or Produced Exhibition or Event - Other (Scholarly Disciplines)';
export const NTRO_SUBTYPE_RREB_PUBLIC_SECTOR = 'Research Report for an External Body - Public Sector';
export const NTRO_SUBTYPE_RREB_INDUSTRY = 'Research Report for an External Body - Industry';
export const NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT = 'Research Report for an External Body - Not-for-profit';
export const NTRO_SUBTYPE_RREB_OTHER = 'Research Report for an External Body - Other';
export const SUBTYPE_RR_INTERNAL_OTHER = 'Research Report - Other or Citation Only';
export const SUBTYPE_EDITED_BOOK = 'Edited book';
export const SUBTYPE_NON_NTRO = 'Non-NTRO';
export const SUBTYPE_FULLY_PUBLISHED_PAPER = 'Fully published paper';
export const SUBTYPE_RESEARCH_BOOK_ORIGINAL_RESEARCH = 'Research book (original research)';
export const SUBTYPE_RESEARCH_BOOK_CHAPTER_ORIGINAL_RESEARCH = 'Research book chapter (original research)';
export const SUBTYPE_CRITICAL_REVIEW = 'Critical review of research, literature review, critical commentary';
export const SUBTYPE_ARTICLE_ORIGINAL_RESEARCH = 'Article (original research)';

export const AUTHOR_AFFILIATIONS_ALLOWED_TYPES = {
    [PUBLICATION_TYPE_BOOK_CHAPTER]: [SUBTYPE_RESEARCH_BOOK_CHAPTER_ORIGINAL_RESEARCH, SUBTYPE_CRITICAL_REVIEW],
    [PUBLICATION_TYPE_BOOK]: [SUBTYPE_RESEARCH_BOOK_ORIGINAL_RESEARCH],
    [PUBLICATION_TYPE_CONFERENCE_PAPER]: [SUBTYPE_FULLY_PUBLISHED_PAPER],
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: [SUBTYPE_ARTICLE_ORIGINAL_RESEARCH, SUBTYPE_CRITICAL_REVIEW],
    // [PUBLICATION_TYPE_RESEARCH_REPORT]: [],
};

export const CW_NTRO_SUBTYPES = [
    NTRO_SUBTYPE_CW_TEXTUAL_WORK,
    NTRO_SUBTYPE_CW_VISUAL_WORK,
    NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION,
    NTRO_SUBTYPE_CW_OTHER,
];

export const RRW_NTRO_SUBTYPES = [
    NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
    NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
    NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
    NTRO_SUBTYPE_RRW_INTERARTS,
    NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
    NTRO_SUBTYPE_RRW_OTHER,
];

export const CPEE_NTRO_SUBTYPES = [
    NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
    NTRO_SUBTYPE_CPEE_FESTIVAL,
    NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION,
    NTRO_SUBTYPE_CPEE_OTHER,
];

export const LP_NTRO_SUBTYPES = [
    NTRO_SUBTYPE_LP_MUSIC,
    NTRO_SUBTYPE_LP_DANCE,
    NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
    NTRO_SUBTYPE_LP_INTERARTS,
    NTRO_SUBTYPE_LP_OTHER,
];

const CREATIVE_WORK_NTRO_SUBTYPES = [
    ...CW_NTRO_SUBTYPES,
    ...LP_NTRO_SUBTYPES,
    ...RRW_NTRO_SUBTYPES,
    ...CPEE_NTRO_SUBTYPES,
];

export const NTRO_RESEARCH_REPORT_SUBTYPES = [
    NTRO_SUBTYPE_RREB_PUBLIC_SECTOR,
    NTRO_SUBTYPE_RREB_INDUSTRY,
    NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT,
    NTRO_SUBTYPE_RREB_OTHER,
];

export const NTRO_SUBTYPES = [
    NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
    ...CREATIVE_WORK_NTRO_SUBTYPES,
    ...NTRO_RESEARCH_REPORT_SUBTYPES,
];

export const NTRO_SUBTYPES_CATEGORY_CODE = {
    [NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK]: 'CW1',
    [NTRO_SUBTYPE_CW_TEXTUAL_WORK]: 'CW1',
    [NTRO_SUBTYPE_CW_VISUAL_WORK]: 'CW1',
    [NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION]: 'CW1',
    [NTRO_SUBTYPE_CW_OTHER]: 'CW1',
    [NTRO_SUBTYPE_LP_MUSIC]: 'CW2',
    [NTRO_SUBTYPE_LP_DANCE]: 'CW2',
    [NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE]: 'CW2',
    [NTRO_SUBTYPE_LP_INTERARTS]: 'CW2',
    [NTRO_SUBTYPE_LP_OTHER]: 'CW2',
    [NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE]: 'CW3',
    [NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING]: 'CW3',
    [NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS]: 'CW3',
    [NTRO_SUBTYPE_RRW_INTERARTS]: 'CW3',
    [NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION]: 'CW3',
    [NTRO_SUBTYPE_RRW_OTHER]: 'CW3',
    [NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT]: 'CW4',
    [NTRO_SUBTYPE_CPEE_FESTIVAL]: 'CW4',
    [NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION]: 'CW4',
    [NTRO_SUBTYPE_CPEE_OTHER]: 'CW4',
    [NTRO_SUBTYPE_RREB_PUBLIC_SECTOR]: 'CW5',
    [NTRO_SUBTYPE_RREB_INDUSTRY]: 'CW5',
    [NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT]: 'CW5',
};

export const THESIS_SUBTYPES = [
    {
        value: 'B.A. Thesis',
        text: 'B.A. Thesis',
    },
    {
        value: 'B.Sc Thesis',
        text: 'B.Sc Thesis',
    },
    {
        value: "Bachelor's Thesis",
        text: "Bachelor's Thesis",
    },
    {
        value: 'Higher Doctorate',
        text: 'Higher Doctorate',
    },
    {
        value: 'Honours Thesis',
        text: 'Honours Thesis',
    },
    {
        value: 'M.A. Thesis',
        text: 'M.A. Thesis',
    },
    {
        value: 'M.Sc Thesis',
        text: 'M.Sc Thesis',
    },
    {
        value: "Master's Thesis",
        text: "Master's Thesis",
    },
    {
        value: 'MPhil Thesis',
        text: 'MPhil Thesis',
    },
    {
        value: 'Other',
        text: 'Other',
    },
    {
        value: 'PhD Thesis',
        text: 'PhD Thesis',
    },
    {
        value: 'Professional Doctorate',
        text: 'Professional Doctorate',
    },
];

export const publicationTypes = (components, isAdmin = false) => ({
    [PUBLICATION_TYPE_AUDIO_DOCUMENT]: {
        id: PUBLICATION_TYPE_AUDIO_DOCUMENT,
        name: DOCUMENT_TYPE_AUDIO_DOCUMENT,
        class: 'Uqlibrary\\FezCore\\Types\\Audio',
        formComponent: components ? components.AudioDocumentForm : null,
        citationComponent: components ? components.AudioDocumentCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_BOOK]: {
        id: PUBLICATION_TYPE_BOOK,
        name: DOCUMENT_TYPE_BOOK,
        class: 'Uqlibrary\\FezCore\\Types\\Book',
        isFavourite: true,
        formComponent: components ? components.BookForm : null,
        citationComponent: components ? components.BookCitation : null,
        hasFormComponent: true,
        subtypes: [
            'Research book (original research)',
            'Textbook',
            SUBTYPE_EDITED_BOOK,
            'Reference work, encyclopaedia, manual or handbook',
            NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
            ...CW_NTRO_SUBTYPES,
            'Other',
        ],
    },
    [PUBLICATION_TYPE_BOOK_CHAPTER]: {
        id: PUBLICATION_TYPE_BOOK_CHAPTER,
        name: DOCUMENT_TYPE_BOOK_CHAPTER,
        class: 'Uqlibrary\\FezCore\\Types\\BookChapter',
        isFavourite: true,
        formComponent: components ? components.BookChapterForm : null,
        citationComponent: components ? components.BookChapterCitation : null,
        hasFormComponent: true,
        subtypes: [
            'Research book chapter (original research)',
            'Critical review of research, literature review, critical commentary',
            'Chapter in textbook',
            'Chapter in reference work, encyclopaedia, manual or handbook',
            'Introduction, foreword, editorial or appendix',
            NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
            ...CW_NTRO_SUBTYPES,
            'Other',
        ],
    },

    [PUBLICATION_TYPE_CONFERENCE_PAPER]: {
        id: PUBLICATION_TYPE_CONFERENCE_PAPER,
        name: DOCUMENT_TYPE_CONFERENCE_PAPER,
        class: 'Uqlibrary\\FezCore\\Types\\ConferencePaper',
        isFavourite: true,
        formComponent: components ? components.ConferencePaperForm : null,
        citationComponent: components ? components.ConferencePaperCitation : null,
        hasFormComponent: true,
        subtypes: ['Fully published paper', 'Published abstract', 'Poster', 'Oral presentation', 'Other'],
    },
    [PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS]: {
        id: PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
        name: DOCUMENT_TYPE_CONFERENCE_PROCEEDINGS,
        class: 'Uqlibrary\\FezCore\\Types\\ConferenceProceedings',
        formComponent: components ? components.ConferenceProceedingsForm : null,
        citationComponent: components ? components.ConferenceProceedingsCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_CREATIVE_WORK]: {
        id: PUBLICATION_TYPE_CREATIVE_WORK,
        name: DOCUMENT_TYPE_CREATIVE_WORK,
        class: 'Uqlibrary\\FezCore\\Types\\CreativeWork',
        citationComponent: components ? components.CreativeWorkCitation : null,
        formComponent: components ? components.CreativeWorkForm : null,
        vocabId: 453594,
        hasFormComponent: true,
        subtypes: [...CW_NTRO_SUBTYPES, ...LP_NTRO_SUBTYPES, ...RRW_NTRO_SUBTYPES, ...CPEE_NTRO_SUBTYPES],
    },
    [PUBLICATION_TYPE_DATA_COLLECTION]: {
        id: PUBLICATION_TYPE_DATA_COLLECTION,
        name: DOCUMENT_TYPE_DATA_COLLECTION,
        class: 'Uqlibrary\\FezCore\\Types\\DataCollection',
        citationComponent: components ? components.DataCollectionCitation : null,
        hasFormComponent: false,
    },
    [PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT]: {
        id: PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
        name: DOCUMENT_TYPE_DEPARTMENT_TECHNICAL_REPORT,
        class: 'Uqlibrary\\FezCore\\Types\\DepartmentTechnicalReport',
        citationComponent: components ? components.DepartmentTechnicalReportCitation : null,
        formComponent: components ? components.DepartmentTechnicalReportForm : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_DESIGN]: {
        id: PUBLICATION_TYPE_DESIGN,
        name: DOCUMENT_TYPE_DESIGN,
        class: 'Uqlibrary\\FezCore\\Types\\Design',
        citationComponent: components ? components.DesignCitation : null,
        formComponent: components ? components.DesignForm : null,
        hasFormComponent: true,
        subtypes: isAdmin
            ? [SUBTYPE_NON_NTRO, NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK]
            : [NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK],
    },
    [PUBLICATION_TYPE_DIGILIB_IMAGE]: {
        id: PUBLICATION_TYPE_DIGILIB_IMAGE,
        name: DOCUMENT_TYPE_DIGILIB_IMAGE,
        class: 'Uqlibrary\\FezCore\\Types\\DigilibImage',
        citationComponent: components ? components.DigilibImageCitation : null,
        hasFormComponent: false,
    },
    [PUBLICATION_TYPE_GENERIC_DOCUMENT]: {
        id: PUBLICATION_TYPE_GENERIC_DOCUMENT,
        name: DOCUMENT_TYPE_GENERIC_DOCUMENT,
        class: 'Uqlibrary\\FezCore\\Types\\Generic',
        formComponent: components ? components.GenericDocumentForm : null,
        citationComponent: components ? components.GenericDocumentCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_IMAGE]: {
        id: PUBLICATION_TYPE_IMAGE,
        name: DOCUMENT_TYPE_IMAGE,
        class: 'Uqlibrary\\FezCore\\Types\\Image',
        citationComponent: components ? components.ImageDocumentCitation : null,
        formComponent: components ? components.ImageDocumentForm : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_INSTRUMENT]: {
        id: PUBLICATION_TYPE_INSTRUMENT,
        name: DOCUMENT_TYPE_INSTRUMENT,
        class: 'Uqlibrary\\FezCore\\Types\\Instrument',
        citationComponent: components ? components.InstrumentCitation : null,
        hasFormComponent: false,
    },
    [PUBLICATION_TYPE_JOURNAL]: {
        id: PUBLICATION_TYPE_JOURNAL,
        name: DOCUMENT_TYPE_JOURNAL,
        class: 'Uqlibrary\\FezCore\\Types\\Journal',
        citationComponent: components ? components.JournalCitation : null,
        hasFormComponent: false,
    },
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: {
        id: PUBLICATION_TYPE_JOURNAL_ARTICLE,
        name: DOCUMENT_TYPE_JOURNAL_ARTICLE,
        class: 'Uqlibrary\\FezCore\\Types\\JournalArticle',
        isFavourite: true,
        formComponent: components ? components.JournalArticleForm : null,
        citationComponent: components ? components.JournalArticleCitation : null,
        hasFormComponent: true,
        subtypes: [
            'Article (original research)',
            'Critical review of research, literature review, critical commentary',
            'Review of book, film, TV, video, software, performance, music etc',
            'Letter to editor, brief commentary or brief communication',
            'Correction/erratum',
            'Editorial',
            'Discussion - responses, round table/panel discussions, Q&A, reply',
            NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
            ...CW_NTRO_SUBTYPES,
            'Other',
        ],
    },
    [PUBLICATION_TYPE_MANUSCRIPT]: {
        id: PUBLICATION_TYPE_MANUSCRIPT,
        name: DOCUMENT_TYPE_MANUSCRIPT,
        class: 'Uqlibrary\\FezCore\\Types\\Manuscript',
        citationComponent: components ? components.ManuscriptCitation : null,
        hasFormComponent: false,
    },
    [PUBLICATION_TYPE_NEWSPAPER_ARTICLE]: {
        id: PUBLICATION_TYPE_NEWSPAPER_ARTICLE,
        name: DOCUMENT_TYPE_NEWSPAPER_ARTICLE,
        class: 'Uqlibrary\\FezCore\\Types\\NewspaperArticle',
        formComponent: components ? components.NewspaperArticleForm : null,
        citationComponent: components ? components.NewspaperArticleCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_PATENT]: {
        id: PUBLICATION_TYPE_PATENT,
        name: DOCUMENT_TYPE_PATENT,
        class: 'Uqlibrary\\FezCore\\Types\\Patent',
        formComponent: components ? components.PatentForm : null,
        citationComponent: components ? components.PatentCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_PREPRINT]: {
        id: PUBLICATION_TYPE_PREPRINT,
        name: DOCUMENT_TYPE_PREPRINT,
        class: 'Uqlibrary\\FezCore\\Types\\Preprint',
        formComponent: components ? components.PreprintForm : null,
        citationComponent: components ? components.PreprintCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_RESEARCH_REPORT]: {
        id: PUBLICATION_TYPE_RESEARCH_REPORT,
        name: DOCUMENT_TYPE_RESEARCH_REPORT,
        class: 'Uqlibrary\\FezCore\\Types\\ResearchReport',
        formComponent: components ? components.ResearchReportForm : null,
        citationComponent: components ? components.ResearchReportCitation : null,
        hasFormComponent: true,
        subtypes: [...NTRO_RESEARCH_REPORT_SUBTYPES, SUBTYPE_RR_INTERNAL_OTHER],
    },
    [PUBLICATION_TYPE_SEMINAR_PAPER]: {
        id: PUBLICATION_TYPE_SEMINAR_PAPER,
        name: DOCUMENT_TYPE_SEMINAR_PAPER,
        class: 'Uqlibrary\\FezCore\\Types\\SeminarPaper',
        formComponent: components ? components.SeminarPaperForm : null,
        citationComponent: components ? components.SeminarPaperCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_THESIS]: {
        id: PUBLICATION_TYPE_THESIS,
        name: DOCUMENT_TYPE_THESIS,
        class: 'Uqlibrary\\FezCore\\Types\\Thesis',
        formComponent: components ? components.ThesisForm : null,
        citationComponent: components ? components.ThesisCitation : null,
        hasFormComponent: true,
        ...(isAdmin ? { subtypes: THESIS_SUBTYPES.map(type => type.value) } : {}),
    },
    [PUBLICATION_TYPE_VIDEO_DOCUMENT]: {
        id: PUBLICATION_TYPE_VIDEO_DOCUMENT,
        name: DOCUMENT_TYPE_VIDEO_DOCUMENT,
        class: 'Uqlibrary\\FezCore\\Types\\Video',
        formComponent: components ? components.VideoDocumentForm : null,
        citationComponent: components ? components.VideoDocumentCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_WORKING_PAPER]: {
        id: PUBLICATION_TYPE_WORKING_PAPER,
        name: DOCUMENT_TYPE_WORKING_PAPER,
        class: 'Uqlibrary\\FezCore\\Types\\WorkingPaper',
        formComponent: components ? components.WorkingPaperForm : null,
        citationComponent: components ? components.WorkingPaperCitation : null,
        hasFormComponent: true,
    },
    [PUBLICATION_TYPE_REFERENCE_ENTRY]: {
        id: PUBLICATION_TYPE_REFERENCE_ENTRY,
        name: DOCUMENT_TYPE_REFERENCE_ENTRY,
        class: 'Uqlibrary\\FezCore\\Types\\ReferenceEntry',
        citationComponent: components ? components.GenericDocumentCitation : null,
        hasFormComponent: false,
    },
});

export const THESIS_SUBMISSION_SUBTYPES = [
    {
        value: 'MPhil Thesis',
        text: 'MPhil Thesis',
    },
    {
        value: 'PhD Thesis',
        text: 'PhD Thesis',
    },
    {
        value: 'Professional Doctorate',
        text: 'Professional Doctorate',
    },
];

/**
 * File type to name map
 */
export const EXPORT_FORMAT_TO_EXTENSION = {
    excel: 'xlsx',
    endnote: 'enw',
    bibtex: 'bib',
    csv: 'csv',
};

export const ORG_UNITS_VOCAB_ID = 453703;
export const FIELD_OF_RESEARCH_VOCAB_ID = 451780;
export const AIATSIS_CODES_VOCAB_ID = 453669;
export const SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID = 456993;
export const JOURNAL_ADVISORY_STATEMENT_TYPE = 457074;

export const UNPROCESSED_RECORDS_COLLECTION = {
    fez_record_search_key_ismemberof: [
        {
            rek_ismemberof: 'UQ:218198',
            rek_ismemberof_order: 1,
        },
    ],
};

// Default values for createNewRecord
export const NEW_RECORD_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 2,
    ...UNPROCESSED_RECORDS_COLLECTION,
    rek_date: '1000-01-01',
};

export const NEW_COMMUNITY_DEFAULT_VALUES = {
    rek_object_type: 1,
    rek_display_type: 11,
    rek_status: 2,
    rek_title: '',
    rek_description: '',
    rek_date: moment().format(),
    fez_record_search_key_keywords: [],
};

export const NEW_COLLECTION_DEFAULT_VALUES = {
    rek_object_type: 2,
    rek_display_type: 9,
    rek_status: 2,
    rek_title: '',
    rek_description: '',
    rek_date: moment().format(),
    fez_record_search_key_keywords: [],
    fez_record_search_key_ismemberof: [],
};

export const NEW_DATASET_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 3,
    rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
    fez_record_search_key_ismemberof: [
        {
            rek_ismemberof: 'UQ:289097',
            rek_ismemberof_order: 1,
        },
    ],
};

export const HDR_THESIS_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 3,
    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
    rek_display_type: PUBLICATION_TYPE_THESIS,
    fez_record_search_key_language: [
        {
            rek_language: 'eng',
            rek_language_order: 1,
        },
    ],
    fez_record_search_key_org_name: {
        rek_org_name: 'The University of Queensland',
    },
    fileAccessId: 2,
};

export const SBS_THESIS_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 3,
    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:155729' }],
    rek_display_type: PUBLICATION_TYPE_THESIS,
    fez_record_search_key_language: [
        {
            rek_language: 'eng',
            rek_language_order: 1,
        },
    ],
    rek_genre_type: 'Professional Doctorate',
    fez_record_search_key_org_name: {
        rek_org_name: 'The University of Queensland',
    },
    fileAccessId: 4,
};

export const DEFAULT_QUERY_PARAMS = {
    page: 1,
    pageSize: 20,
    sortBy: 'score',
    sortDirection: 'Desc',
    activeFacets: {
        filters: {},
        ranges: {},
    },
};

export const ANY_UNPUBLISHED = -4;
export const IN_CREATION = 4;
export const IN_DRAFT = 6;
export const IN_REVIEW = 5;
export const RETRACTED = 7;
export const SUBMITTED_FOR_APPROVAL = 3;
export const UNPUBLISHED = 1;
export const PUBLISHED = 2;
export const DELETED = 8;

export const UNPUBLISHED_STATUS = [
    {
        value: 'Any unpublished',
        text: 'Any unpublished',
    },
    {
        value: 'In Creation',
        text: 'In Creation',
    },
    {
        value: 'In Draft',
        text: 'In Draft',
    },
    {
        value: 'In Review',
        text: 'In Review',
    },
    {
        value: 'Retracted',
        text: 'Retracted',
    },
    {
        value: 'Submitted for Approval',
        text: 'Submitted for Approval',
    },
    {
        value: 'Unpublished',
        text: 'Unpublished',
    },
];

export const UNPUBLISHED_STATUS_MAP = {
    'Any unpublished': ANY_UNPUBLISHED,
    'In Creation': IN_CREATION,
    'In Draft': IN_DRAFT,
    'In Review': IN_REVIEW,
    Retracted: RETRACTED,
    'Submitted for Approval': SUBMITTED_FOR_APPROVAL,
    Unpublished: UNPUBLISHED,
    Deleted: DELETED,
};

export const UNPUBLISHED_STATUS_TEXT_MAP = {
    [ANY_UNPUBLISHED]: 'Any unpublished',
    [IN_CREATION]: 'In Creation',
    [IN_DRAFT]: 'In Draft',
    [IN_REVIEW]: 'In Review',
    [RETRACTED]: 'Retracted',
    [SUBMITTED_FOR_APPROVAL]: 'Submitted for Approval',
    [UNPUBLISHED]: 'Unpublished',
    [DELETED]: 'Deleted',
};
export const DATA_COLLECTION_CREATOR_ROLES = [
    {
        value: 'Project lead/Principal investigator',
        text: 'Project lead/Principal investigator',
    },
    {
        value: 'Co-investigator',
        text: 'Co-investigator',
    },
    {
        value: 'Higher degree research student',
        text: 'Higher degree research student',
    },
    {
        value: 'Research assistant',
        text: 'Research assistant',
    },
    {
        value: 'Software engineer',
        text: 'Software engineer',
    },
    {
        value: 'Statistician',
        text: 'Statistician',
    },
    {
        value: 'Technician',
        text: 'Technician',
    },
];

export const CURRENT_LICENCES = [
    {
        value: 453701,
        text: 'Permitted Re-use with Acknowledgement',
        description: [
            'I AGREE TO ACKNOWLEDGE any re-use of this dataset in any research outputs where reliance is made upon it, including conference papers and published research papers.',
            'The agreed form of acknowledgement is as a full citation as presented on the UQ eSpace record for this dataset.',
        ],
    },
    {
        value: 454104,
        text: 'Permitted Re-Use with Commercial Use Restriction',
        description: [
            'I AGREE TO ACKNOWLEDGE any re-use of this dataset in any research outputs where reliance is made upon it, including conference papers and published research papers.',
            'I FURTHER AGREE TO A COMMERCIAL USE RESTRICTION on this dataset, or data included in it and to only use this data in non-commercial endeavours.',
            'The agreed form of acknowledgement is a full citation as presented on the UQ eSpace record for this record for this dataset.',
        ],
    },
    {
        value: 454105,
        text: 'Permitted Re-Use with Share Alike Requirement',
        description: [
            'I AGREE TO ACKNOWLEDGE any re-use of this dataset in any research outputs where reliance is made upon it, including conference papers and published research papers.',
            'I FURTHER AGREE TO A SHARE ALIKE RESTRICTION on this dataset, or any data included in it, which means that I Agree that I remix, transform or build upon the data, I will contributions on the same Share Alike basis as the original.',
            'The agreed form of acknowledgement is a full citation as presented on the UQ eSpace record for this record for this dataset.',
        ],
    },
    {
        value: 456807,
        text: 'Permitted reuse only with a Data Sharing Agreement in place between UQ and recipient',
        description: [
            'I AGREE TO ACKNOWLEDGE any re-use of this dataset in any research outputs where reliance is made upon it, including conference papers and published research papers.',
            'I FURTHER AGREE that my re-use of this dataset will fully comply with all terms and conditions of the Data Sharing Agreement established between myself and UQ for this purpose.',
            'The agreed form of acknowledgement is a full citation as presented on the UQ eSpace record for this dataset.',
        ],
    },
];

export const CCL_BY_3_0_ID = 453608;
export const CCL_BY_SA_3_0_ID = 453613;
export const CCL_BY_ND_3_0_ID = 453609;
export const CCL_BY_NC_3_0_ID = 453610;
export const CCL_BY_NC_SA_3_0_ID = 453612;
export const CCL_BY_NC_ND_3_0_ID = 453611;

export const CCL_BY_4_0_ID = 456710;
export const CCL_BY_SA_4_0_ID = 456711;
export const CCL_BY_ND_4_0_ID = 456712;
export const CCL_BY_NC_4_0_ID = 456713;
export const CCL_BY_NC_SA_4_0_ID = 456714;
export const CCL_BY_NC_ND_4_0_ID = 456715;
export const CCL_ZERO_ID = 457088;

export const CCL_SLUG_BY = 'by';
export const CCL_SLUG_BY_SA = 'by-sa';
export const CCL_SLUG_BY_ND = 'by-nd';
export const CCL_SLUG_BY_NC = 'by-nc';
export const CCL_SLUG_BY_NC_SA = 'by-nc-sa';
export const CCL_SLUG_BY_NC_ND = 'by-nc-nd';

export const CCL_BY = version => `Creative Commons Attribution ${version} International (CC BY ${version})`;
export const CCL_BY_SA = version =>
    `Creative Commons Attribution-ShareAlike ${version} International (CC BY-SA ${version})`;
export const CCL_BY_ND = version =>
    `Creative Commons Attribution-NoDerivatives ${version} International (CC BY-ND ${version})`;
export const CCL_BY_NC = version =>
    `Creative Commons Attribution-NonCommercial ${version} International (CC BY-NC ${version})`;
export const CCL_BY_NC_SA = version =>
    `Creative Commons Attribution-NonCommerical-ShareAlike ${version} International (CC BY-NC-SA ${version})`;
export const CCL_BY_NC_ND = version =>
    `Creative Commons Attribution-NonCommercial-NoDerivatives ${version} International (CC BY-NC-ND ${version})`;

export const CCL_3_0_SLUG_TEXT_MAP = {
    [CCL_SLUG_BY]: CCL_BY('3.0'),
    [CCL_SLUG_BY_SA]: CCL_BY_SA('3.0'),
    [CCL_SLUG_BY_ND]: CCL_BY_ND('3.0'),
    [CCL_SLUG_BY_NC]: CCL_BY_NC('3.0'),
    [CCL_SLUG_BY_NC_SA]: CCL_BY_NC_SA('3.0'),
    [CCL_SLUG_BY_NC_ND]: CCL_BY_NC_ND('3.0'),
};

export const CCL_4_0_SLUG_TEXT_MAP = {
    [CCL_SLUG_BY]: CCL_BY('4.0'),
    [CCL_SLUG_BY_SA]: CCL_BY_SA('4.0'),
    [CCL_SLUG_BY_ND]: CCL_BY_ND('4.0'),
    [CCL_SLUG_BY_NC]: CCL_BY_NC('4.0'),
    [CCL_SLUG_BY_NC_SA]: CCL_BY_NC_SA('4.0'),
    [CCL_SLUG_BY_NC_ND]: CCL_BY_NC_ND('4.0'),
};

export const CREATIVE_COMMONS_LICENSES_3_0 = [
    {
        value: CCL_BY_3_0_ID,
        text: CCL_BY('3.0'),
    },
    {
        value: CCL_BY_SA_3_0_ID,
        text: CCL_BY_SA('3.0'),
    },
    {
        value: CCL_BY_ND_3_0_ID,
        text: CCL_BY_ND('3.0'),
    },
    {
        value: CCL_BY_NC_3_0_ID,
        text: CCL_BY_NC('3.0'),
    },
    {
        value: CCL_BY_NC_SA_3_0_ID,
        text: CCL_BY_NC_SA('3.0'),
    },
    {
        value: CCL_BY_NC_ND_3_0_ID,
        text: CCL_BY_NC_ND('3.0'),
    },
];

export const CREATIVE_COMMONS_LICENSES_4_0 = [
    {
        value: CCL_BY_4_0_ID,
        text: CCL_BY('4.0'),
    },
    {
        value: CCL_BY_SA_4_0_ID,
        text: CCL_BY_SA('4.0'),
    },
    {
        value: CCL_BY_ND_4_0_ID,
        text: CCL_BY_ND('4.0'),
    },
    {
        value: CCL_BY_NC_4_0_ID,
        text: CCL_BY_NC('4.0'),
    },
    {
        value: CCL_BY_NC_SA_4_0_ID,
        text: CCL_BY_NC_SA('4.0'),
    },
    {
        value: CCL_BY_NC_ND_4_0_ID,
        text: CCL_BY_NC_ND('4.0'),
    },
];

export const CCL_ZERO = {
    value: CCL_ZERO_ID,
    text: 'Creative Commons Zero 1.0 Universal (CC0 1.0)',
};

export const getCreativeCommonsUrl = version => conditionSlug =>
    `https://creativecommons.org/licenses/${conditionSlug}/${version}/deed.en`;

export const ALL_LICENCES = [
    {
        value: -1,
        text: 'None',
    },
    ...CURRENT_LICENCES,
    ...CREATIVE_COMMONS_LICENSES_4_0,
    ...CREATIVE_COMMONS_LICENSES_3_0,
    CCL_ZERO,
];

export const ORG_TYPE_ID_MUSEUM = '453983';
export const ORG_TYPE_ID_GALLERY = '453984';
export const ORG_TYPE_ID_GOVERNMENT = '453985';
export const ORG_TYPE_ID_NGO = '453986';
export const ORG_TYPE_ID_FOUNDATION = '453987';
export const ORG_TYPE_ID_CORPORATE = '453988';
export const ORG_TYPE_ID_UNIVERSITY = '453989';
export const ORG_TYPE_ID_OTHER = '453990';
export const ORG_TYPE_NOT_SET = '454045';

export const ORG_TYPES_LOOKUP = {
    [ORG_TYPE_ID_MUSEUM]: 'Library/Museum/Public Gallery',
    [ORG_TYPE_ID_GALLERY]: 'Commercial Gallery',
    [ORG_TYPE_ID_GOVERNMENT]: 'Government',
    [ORG_TYPE_ID_NGO]: 'NGO',
    [ORG_TYPE_ID_FOUNDATION]: 'Foundation',
    [ORG_TYPE_ID_CORPORATE]: 'Corporate/Industry',
    [ORG_TYPE_ID_UNIVERSITY]: 'University',
    [ORG_TYPE_ID_OTHER]: 'Other',
    [ORG_TYPE_NOT_SET]: 'Not set',
};

export const GRANT_AGENCY_TYPES = [
    'Library/Museum/Public Gallery',
    'Commercial Gallery',
    'Government',
    'NGO',
    'Foundation',
    'Corporate/Industry',
    'University',
    'Other',
    'Not set',
];

export const ORG_AFFILIATION_TYPES = [
    { value: '453983', text: 'Library/Museum/Public Gallery' },
    { value: '453984', text: 'Commercial Gallery' },
    { value: '453985', text: 'Government' },
    { value: '453986', text: 'NGO' },
    { value: '453987', text: 'Foundation' },
    { value: '453988', text: 'Corporate/Industry' },
    { value: '453989', text: 'University' },
    { value: '453990', text: 'Other' },
    { value: '454045', text: 'Not set' },
];

export const NEW_DOCTYPES_OPTIONS = [
    PUBLICATION_TYPE_DESIGN_CW_ARCHITECTURAL_WORK,
    PUBLICATION_TYPE_CW_TEXTUAL_WORK_BOOK,
    PUBLICATION_TYPE_CW_TEXTUAL_WORK_BOOK_CHAPTER,
    PUBLICATION_TYPE_CW_TEXTUAL_WORK_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_CW_TEXTUAL_WORK_CREATIVE_WORK,
    PUBLICATION_TYPE_CW_VISUAL_WORK_CREATIVE_WORK,
    PUBLICATION_TYPE_CW_MUSICAL_COMPOSITION_CREATIVE_WORK,
    PUBLICATION_TYPE_CW_OTHER_CREATIVE_WORK,
    PUBLICATION_TYPE_LP_MUSIC,
    PUBLICATION_TYPE_LP_DANCE,
    PUBLICATION_TYPE_LP_PLAYS_DRAMAS_THEATRE,
    PUBLICATION_TYPE_LP_INTERARTS,
    PUBLICATION_TYPE_LP_OTHER,
    PUBLICATION_TYPE_RRW_MUSIC_DANCE_THEATRE,
    PUBLICATION_TYPE_RRW_AUDIO_VISUAL_RECORDING,
    PUBLICATION_TYPE_RRW_DIGITAL_CREATIVE_WORKS,
    PUBLICATION_TYPE_RRW_INTERARTS,
    PUBLICATION_TYPE_RRW_WEBSITE_EXHIBITION,
    PUBLICATION_TYPE_RRW_OTHER,
    PUBLICATION_TYPE_CPEE_EXHIBITION_EVENT,
    PUBLICATION_TYPE_CPEE_FESTIVAL,
    PUBLICATION_TYPE_CPEE_WEB_BASED_EXHIBITION,
    PUBLICATION_TYPE_CPEE_OTHER,
    PUBLICATION_TYPE_RREB_PUBLIC_SECTOR,
    PUBLICATION_TYPE_RREB_INDUSTRY,
    PUBLICATION_TYPE_RREB_NOT_FOR_PROFIT,
    PUBLICATION_TYPE_RREB_OTHER,
    PUBLICATION_TYPE_RR_INTERNAL_OTHER,
];

export const DOCTYPE_SUBTYPE_MAPPING = {
    [PUBLICATION_TYPE_DESIGN_CW_ARCHITECTURAL_WORK]: {
        docTypeId: PUBLICATION_TYPE_DESIGN,
        subtype: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
        name: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
    },
    [PUBLICATION_TYPE_CW_TEXTUAL_WORK_BOOK]: {
        docTypeId: PUBLICATION_TYPE_BOOK,
        subtype: NTRO_SUBTYPE_CW_TEXTUAL_WORK,
        name: `${NTRO_SUBTYPE_CW_TEXTUAL_WORK} (Book)`,
    },
    [PUBLICATION_TYPE_CW_TEXTUAL_WORK_BOOK_CHAPTER]: {
        docTypeId: PUBLICATION_TYPE_BOOK_CHAPTER,
        subtype: NTRO_SUBTYPE_CW_TEXTUAL_WORK,
        name: `${NTRO_SUBTYPE_CW_TEXTUAL_WORK} (Book chapter)`,
    },
    [PUBLICATION_TYPE_CW_TEXTUAL_WORK_JOURNAL_ARTICLE]: {
        docTypeId: PUBLICATION_TYPE_JOURNAL_ARTICLE,
        subtype: NTRO_SUBTYPE_CW_TEXTUAL_WORK,
        name: `${NTRO_SUBTYPE_CW_TEXTUAL_WORK} (Journal article)`,
    },
    [PUBLICATION_TYPE_CW_TEXTUAL_WORK_CREATIVE_WORK]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_CW_TEXTUAL_WORK,
        name: `${NTRO_SUBTYPE_CW_TEXTUAL_WORK}`,
    },
    [PUBLICATION_TYPE_CW_VISUAL_WORK_CREATIVE_WORK]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_CW_VISUAL_WORK,
        name: NTRO_SUBTYPE_CW_VISUAL_WORK,
    },
    [PUBLICATION_TYPE_CW_MUSICAL_COMPOSITION_CREATIVE_WORK]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION,
        name: NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION,
    },
    [PUBLICATION_TYPE_CW_OTHER_CREATIVE_WORK]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_CW_OTHER,
        name: NTRO_SUBTYPE_CW_OTHER,
    },
    [PUBLICATION_TYPE_LP_MUSIC]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_LP_MUSIC,
        name: NTRO_SUBTYPE_LP_MUSIC,
    },
    [PUBLICATION_TYPE_LP_DANCE]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_LP_DANCE,
        name: NTRO_SUBTYPE_LP_DANCE,
    },
    [PUBLICATION_TYPE_LP_PLAYS_DRAMAS_THEATRE]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
        name: NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
    },
    [PUBLICATION_TYPE_LP_INTERARTS]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_LP_INTERARTS,
        name: NTRO_SUBTYPE_LP_INTERARTS,
    },
    [PUBLICATION_TYPE_LP_OTHER]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_LP_OTHER,
        name: NTRO_SUBTYPE_LP_OTHER,
    },
    [PUBLICATION_TYPE_RRW_MUSIC_DANCE_THEATRE]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
        name: NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
    },
    [PUBLICATION_TYPE_RRW_AUDIO_VISUAL_RECORDING]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
        name: NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
    },
    [PUBLICATION_TYPE_RRW_DIGITAL_CREATIVE_WORKS]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
        name: NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
    },
    [PUBLICATION_TYPE_RRW_INTERARTS]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_RRW_INTERARTS,
        name: NTRO_SUBTYPE_RRW_INTERARTS,
    },
    [PUBLICATION_TYPE_RRW_WEBSITE_EXHIBITION]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
        name: NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
    },
    [PUBLICATION_TYPE_RRW_OTHER]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_RRW_OTHER,
        name: NTRO_SUBTYPE_RRW_OTHER,
    },
    [PUBLICATION_TYPE_CPEE_EXHIBITION_EVENT]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
        name: NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
    },
    [PUBLICATION_TYPE_CPEE_FESTIVAL]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_CPEE_FESTIVAL,
        name: NTRO_SUBTYPE_CPEE_FESTIVAL,
    },
    [PUBLICATION_TYPE_CPEE_WEB_BASED_EXHIBITION]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION,
        name: NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION,
    },
    [PUBLICATION_TYPE_CPEE_OTHER]: {
        docTypeId: PUBLICATION_TYPE_CREATIVE_WORK,
        subtype: NTRO_SUBTYPE_CPEE_OTHER,
        name: NTRO_SUBTYPE_CPEE_OTHER,
    },
    [PUBLICATION_TYPE_RREB_PUBLIC_SECTOR]: {
        docTypeId: PUBLICATION_TYPE_RESEARCH_REPORT,
        subtype: NTRO_SUBTYPE_RREB_PUBLIC_SECTOR,
        name: NTRO_SUBTYPE_RREB_PUBLIC_SECTOR,
    },
    [PUBLICATION_TYPE_RREB_INDUSTRY]: {
        docTypeId: PUBLICATION_TYPE_RESEARCH_REPORT,
        subtype: NTRO_SUBTYPE_RREB_INDUSTRY,
        name: NTRO_SUBTYPE_RREB_INDUSTRY,
    },
    [PUBLICATION_TYPE_RREB_NOT_FOR_PROFIT]: {
        docTypeId: PUBLICATION_TYPE_RESEARCH_REPORT,
        subtype: NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT,
        name: NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT,
    },
    [PUBLICATION_TYPE_RREB_OTHER]: {
        docTypeId: PUBLICATION_TYPE_RESEARCH_REPORT,
        subtype: NTRO_SUBTYPE_RREB_OTHER,
        name: NTRO_SUBTYPE_RREB_OTHER,
    },
    [PUBLICATION_TYPE_RR_INTERNAL_OTHER]: {
        docTypeId: PUBLICATION_TYPE_RESEARCH_REPORT,
        subtype: SUBTYPE_RR_INTERNAL_OTHER,
        name: SUBTYPE_RR_INTERNAL_OTHER,
    },
};

export const SIGNIFICANCE_MAJOR = 454026;
export const SIGNIFICANCE_MINOR = 454027;

export const SIGNIFICANCE = [
    { text: 'Minor', value: SIGNIFICANCE_MINOR },
    { text: 'Major', value: SIGNIFICANCE_MAJOR },
];

export const SIGNIFICANCE_MAP = {
    [SIGNIFICANCE_MINOR]: 'Minor',
    [SIGNIFICANCE_MAJOR]: 'Major',
};

export const QUALITY_INDICATORS = [
    { value: 453996, text: 'Disseminated via nationally recognised outlet or entity' },
    { value: 453997, text: 'Disseminated via internationally recognised outlet or entity' },
    { value: 454033, text: 'Association with recognised national entities, distinct from co-creation' },
    { value: 454034, text: 'Association with recognised international entities, distinct from co-creation' },
    { value: 454035, text: 'Reviews, prizes, awards recognition of the output' },
    { value: 454036, text: 'Commissioned by external body' },
    { value: 454037, text: 'Repeat performances, reproductions, republications or re-exhibitions' },
    { value: 454038, text: 'Selected for use by nationally recognised outlet or entity' },
    { value: 454039, text: 'Selected for use by internationally recognised outlet or entity' },
    { value: 454040, text: 'Other (add details to Author/Creator research statement)' },
];

export const CONTENT_INDICATORS = [
    { value: 454079, text: 'Scholarship of Teaching and Learning' },
    { value: 454080, text: 'Protocol' },
    { value: 454081, text: 'Case Study' },
];

export const CONTENT_INDICATORS_FOR_CONFERENCE_PAPER = [
    { value: 456746, text: 'Plenary' },
    { value: 456747, text: 'Invited' },
];

export const CONTENT_INDICATORS_DOCTYPE_MAP = {
    default: CONTENT_INDICATORS,
    [PUBLICATION_TYPE_CONFERENCE_PAPER]: [...CONTENT_INDICATORS, ...CONTENT_INDICATORS_FOR_CONFERENCE_PAPER],
};

export const contentIndicators = displayType =>
    CONTENT_INDICATORS_DOCTYPE_MAP[(displayType === PUBLICATION_TYPE_CONFERENCE_PAPER && displayType) || 'default'];

export const AUDIENCE_SIZE = [
    { value: 453992, text: 'Less than 100' },
    { value: 453993, text: '100 - 500' },
    { value: 453994, text: 'Greater than 500' },
];

export const LANGUAGE = [
    { value: 'afr', text: 'Afrikaans' },
    { value: 'alb', text: 'Albanian' },
    { value: 'ara', text: 'Arabic' },
    { value: 'aus', text: 'Australian Indigenous' },
    { value: 'bos', text: 'Bosnian' },
    { value: 'cat', text: 'Catalan' },
    { value: 'chi', text: 'Chinese' },
    { value: 'cop', text: 'Coptic' },
    { value: 'cze', text: 'Czech' },
    { value: 'dan', text: 'Danish' },
    { value: 'dut', text: 'Dutch' },
    { value: 'egy', text: 'Egyptian (Ancient)' },
    { value: 'elx', text: 'Elamite' },
    { value: 'eng', text: 'English' },
    { value: 'enm', text: 'English (Ancient)' },
    { value: 'epo', text: 'Esperanto' },
    { value: 'est', text: 'Estonian' },
    { value: 'fin', text: 'Finnish' },
    { value: 'fre', text: 'French' },
    { value: 'ger', text: 'German' },
    { value: 'gem', text: 'Germanic' },
    { value: 'grc', text: 'Greek (Ancient)' },
    { value: 'gre', text: 'Greek' },
    { value: 'heb', text: 'Hebrew' },
    { value: 'hrv', text: 'Croatian' },
    { value: 'hun', text: 'Hungarian' },
    { value: 'ind', text: 'Indonesian' },
    { value: 'ira', text: 'Iranian' },
    { value: 'ita', text: 'Italian' },
    { value: 'jpn', text: 'Japanese' },
    { value: 'kor', text: 'Korean' },
    { value: 'lao', text: 'Lao' },
    { value: 'lat', text: 'Latin' },
    { value: 'lav', text: 'Latvian' },
    { value: 'lit', text: 'Lithuanian' },
    { value: 'mac', text: 'Macedonian' },
    { value: 'mal', text: 'Malayalam' },
    { value: 'may', text: 'Malay' },
    { value: 'mon', text: 'Mongolian' },
    { value: 'nah', text: 'Nahuatl' },
    { value: 'nor', text: 'Norwegian' },
    { value: 'ota', text: 'Turkish (Ottoman)' },
    { value: 'paa', text: 'Papuan' },
    { value: 'per', text: 'Persian' },
    { value: 'pol', text: 'Polish' },
    { value: 'por', text: 'Portuguese' },
    { value: 'rum', text: 'Romanian' },
    { value: 'rus', text: 'Russian' },
    { value: 'san', text: 'Sanskrit' },
    { value: 'slo', text: 'Slovak' },
    { value: 'slv', text: 'Slovenian' },
    { value: 'spa', text: 'Spanish' },
    { value: 'srp', text: 'Serbian' },
    { value: 'swe', text: 'Swedish' },
    { value: 'syc', text: 'Classical Syriac' },
    { value: 'syr', text: 'Syriac' },
    { value: 'tet', text: 'Tetum' },
    { value: 'tha', text: 'Thai' },
    { value: 'tur', text: 'Turkish' },
    { value: 'ukr', text: 'Ukrainian' },
    { value: 'vie', text: 'Vietnamese' },
    { value: 'war', text: 'Waray' },
    { value: 'yid', text: 'Yiddish' },
];

export const PATH_PREFIX = !process.env.USE_MOCK && process.env.NODE_ENV === 'development' ? '#/' : '';
export const DELETE_SELECTED_RECORD_LABEL = 'Delete selected record';
export const UPDATE_DELETED_RECORD_LABEL = 'Update tombstone page info';

export const RECORD_ACTION_URLS = [
    {
        label: 'Edit selected record',
        url: pid => `${APP_URL}${PATH_PREFIX}admin/edit/${pid}`,
        inApp: true,
        showInDeleted: true,
        options: null,
        isRecordEdit: true,
    },
    {
        label: 'Edit author affiliations',
        url: pid => `${APP_URL}${PATH_PREFIX}admin/edit/${pid}?tab=authors`,
        inApp: true,
        showInDeleted: false,
        options: null,
    },
    {
        label: 'Edit security for selected record',
        inApp: true,
        showInDeleted: false,
        options: null,
        url: pid => `${APP_URL}${PATH_PREFIX}admin/edit/${pid}?tab=security`,
    },
    {
        label: hasDoi => `${hasDoi ? 'Update' : 'Create'} DOI`,
        inApp: true,
        options: null,
        url: pid => `${APP_URL}${PATH_PREFIX}admin/doi/${pid}`,
        isDoi: true,
    },
    {
        label: DELETE_SELECTED_RECORD_LABEL,
        url: pid => `${APP_URL}${PATH_PREFIX}admin/delete/${pid}`,
        inApp: true,
        showInDeleted: false,
        options: null,
    },
    {
        label: UPDATE_DELETED_RECORD_LABEL,
        url: pid => `${APP_URL}${PATH_PREFIX}admin/delete/${pid}`,
        inApp: true,
        showInDeleted: true,
        options: null,
    },
    {
        label: 'Change display type',
        url: pid => `${APP_URL}${PATH_PREFIX}admin/change-display-type/${pid}`,
        inApp: true,
        showInDeleted: false,
        options: null,
        isChangeDisplayMenu: true,
    },
];
export const JOURNAL_ACTION_URLS = [
    {
        label: 'Edit selected journal',
        url: jid => `${APP_URL}${PATH_PREFIX}admin/journal/edit/${jid}`,
        inApp: true,
        options: null,
        isJournalEdit: true,
    },
];

export const MAXIMUM_SECURITY_PUBLIC = 5;
export const TOP_LEVEL_SECURITY_POLICIES = [
    {
        id: 1,
        value: 1,
        name: 'Administrators',
        label: 'Administrators',
        order: 0,
    },
    {
        id: 2,
        value: 2,
        name: 'Theses Assessors',
        label: 'Theses Assessors',
        order: 10,
    },
    {
        id: 3,
        value: 3,
        name: 'Evidence Assessors',
        label: 'Evidence Assessors',
        order: 20,
    },
    {
        id: 4,
        value: 4,
        name: 'Staff and Students',
        label: 'Staff and Students',
        order: 30,
    },
    {
        id: 5,
        value: MAXIMUM_SECURITY_PUBLIC,
        name: 'Public',
        label: 'Public',
        order: 100,
    },
];

export const DATA_STREAM_SECURITY_POLICIES = TOP_LEVEL_SECURITY_POLICIES;

export const RECORD_TYPE_COMMUNITY_ID = 11;
export const RECORD_TYPE_COLLECTION_ID = 9;
export const RECORD_TYPE_COMMUNITY = 'community';
export const RECORD_TYPE_COLLECTION = 'collection';
export const RECORD_TYPE_LOOKUP = {
    [RECORD_TYPE_COMMUNITY_ID]: RECORD_TYPE_COMMUNITY,
    [RECORD_TYPE_COLLECTION_ID]: RECORD_TYPE_COLLECTION,
};
export const RECORD_TYPE_RECORD = 'record';
export const CONTENT_INDICATORS_DOCTYPE_BLACKLIST = [
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_THESIS,
    PUBLICATION_TYPE_MANUSCRIPT,
    PUBLICATION_TYPE_IMAGE,
    PUBLICATION_TYPE_DIGILIB_IMAGE,
];

export const PUBLICATION_EXCLUDE_CITATION_TEXT_LIST = [RECORD_TYPE_COMMUNITY, RECORD_TYPE_COLLECTION];

export const CONTENT_INDICATORS_COLLECTIONS_BLACKLIST = [
    'UQ:244548',
    'UQ:693105',
    'UQ:152694',
    'UQ:335745',
    'UQ:229001',
];

export const WOS_DOC_TYPES = [
    { value: 'None', text: 'None' },
    { value: 'All document types', text: 'All document types' },
    { value: '2', text: '2 - Abstract of Published item' },
    { value: 'A', text: 'A - Art Exhibit Review' },
    { value: '@', text: '@ - Article' },
    { value: '7', text: '7 - Bibliography' },
    { value: 'I', text: 'I - Biographical-Item' },
    { value: 'Book', text: 'Book' },
    { value: 'Book Chapter', text: 'Book Chapter' },
    { value: 'B', text: 'B - Book Review' },
    { value: 'K', text: 'K - Chronology' },
    { value: 'Correction', text: 'Correction' },
    { value: 'C', text: 'C - Correction, Addition' },
    { value: 'Z', text: 'Z - Dance Performance Review' },
    { value: 'Data Paper', text: 'Data Paper' },
    { value: '0', text: '0 - Database Review' },
    { value: 'D', text: 'D - Discussion' },
    {
        value: 'Early Access (Web of Science Core Collection only)',
        text: 'Early Access (Web of Science Core Collection only)',
    },
    { value: 'E', text: 'E - Editorial Material' },
    { value: 'X', text: 'X - Excerpt' },
    { value: 'O', text: 'O - Fiction, Creative Prose' },
    { value: 'F', text: 'F - Film Review' },
    { value: 'P', text: 'P - Fully Published Paper' },
    { value: 'U', text: 'U - Fully Published Paper' },
    { value: '8', text: '8 - Hardware Review' },
    { value: 'Item About an Individual', text: 'Item About an Individual' },
    { value: 'L', text: 'L - Letter' },
    { value: 'MC', text: 'MC - Meeting Abstract' },
    { value: 'Meeting Summary', text: 'Meeting Summary' },
    { value: 'M', text: 'M - Meeting Abstract' },
    { value: 'J', text: 'J - Music Performance Review' },
    { value: 'S', text: 'S - Music Score' },
    { value: 'G', text: 'G - Music Score Review' },
    { value: '5', text: '5 - News Item' },
    { value: 'N', text: 'N - Note' },
    { value: 'Y', text: 'Y - Poetry' },
    { value: '$', text: '$ - Proceedings Paper' },
    { value: 'H', text: 'H - Record Review' },
    { value: '6', text: '6 - Reprint' },
    { value: 'Retracted Publication', text: 'Retracted Publication' },
    { value: 'Retraction', text: 'Retraction' },
    { value: 'R', text: 'R - Review' },
    { value: 'Q', text: 'Q - Script' },
    { value: '9', text: '9 - Software Review' },
    { value: 'T', text: 'T - Theater Review' },
    { value: 'TV Review, Radio Review', text: 'TV Review, Radio Review' },
    { value: 'V', text: 'V - TV Review, Radio Review, Video Review' },
];

export const SCOPUS_DOC_TYPES = [
    { value: 'None', text: 'None' },
    { value: 'ab', text: 'ab - Abstract Report' },
    { value: 'ar', text: 'ar - Article' },
    { value: 'ip', text: 'ip - Article in Press' },
    { value: 'bk', text: 'bk - Book' },
    { value: 'ch', text: 'ch - Book Chapter' },
    { value: 'bz', text: 'bz - Business Article' },
    { value: 'cp', text: 'cp - Conference Paper' },
    { value: 'cr', text: 'cr - Conference Review' },
    { value: 'ed', text: 'ed - Editorial' },
    { value: 'er', text: 'er - Erratum' },
    { value: 'le', text: 'le - Letter' },
    { value: 'no', text: 'no - Note' },
    { value: 'pr', text: 'pr - Press Release' },
    { value: 'rp', text: 'rp - Report' },
    { value: 're', text: 're - Review' },
    { value: 'sh', text: 'sh - Short Survey' },
];

export const OPENALEX_DOC_TYPES = [
    { value: 'None', text: 'None' },
    { value: 'article', text: 'article' },
    { value: 'book-chapter', text: 'book-chapter' },
    { value: 'dataset', text: 'dataset' },
    { value: 'preprint', text: 'preprint' },
    { value: 'dissertation', text: 'dissertation' },
    { value: 'book', text: 'book' },
    { value: 'review', text: 'review' },
    { value: 'paratext', text: 'paratext' },
    { value: 'other', text: 'other' },
    { value: 'libguides', text: 'libguides' },
    { value: 'reference-entry', text: 'reference-entry' },
    { value: 'report', text: 'report' },
    { value: 'peer-review', text: 'peer-review' },
    { value: 'editorial', text: 'editorial' },
    { value: 'erratum', text: 'erratum' },
    { value: 'standard', text: 'standard' },
    { value: 'grant', text: 'grant' },
    { value: 'supplementary-materials', text: 'supplementary-materials' },
    { value: 'retraction', text: 'retraction' },
    { value: 'book-section', text: 'book-section' },
    { value: 'software', text: 'software' },
    { value: 'database', text: 'database' },
    { value: 'report-component', text: 'report-component' },
];

export const PUBMED_DOC_TYPES = [
    { value: 'None', text: 'None' },
    { value: 'Addresses', text: 'Addresses' },
    { value: 'Autobiography', text: 'Autobiography' },
    { value: 'Bibliography', text: 'Bibliography' },
    { value: 'Biography', text: 'Biography' },
    { value: 'Case Reports', text: 'Case Reports' },
    { value: 'Clinical Conference', text: 'Clinical Conference' },
    { value: 'Clinical Study', text: 'Clinical Study' },
    { value: 'Clinical Trial', text: 'Clinical Trial' },
    { value: 'Clinical Trial, Phase I', text: 'Clinical Trial, Phase I' },
    { value: 'Clinical Trial, Phase II', text: 'Clinical Trial, Phase II' },
    { value: 'Clinical Trial, Phase III', text: 'Clinical Trial, Phase III' },
    { value: 'Clinical Trial, Phase IV', text: 'Clinical Trial, Phase IV' },
    { value: 'Comparative Study', text: 'Comparative Study' },
    { value: 'Congresses', text: 'Congresses' },
    { value: 'Consensus Development Conference', text: 'Consensus Development Conference' },
    { value: 'Consensus Development Conference, NIH', text: 'Consensus Development Conference, NIH' },
    { value: 'Controlled Clinical Trial', text: 'Controlled Clinical Trial' },
    { value: 'Dataset', text: 'Dataset' },
    { value: 'Editorial', text: 'Editorial' },
    { value: 'English Abstract', text: 'English Abstract' },
    { value: 'Evaluation Studies', text: 'Evaluation Studies' },
    { value: 'Guideline', text: 'Guideline' },
    { value: 'Historical Article', text: 'Historical Article' },
    { value: 'Interview', text: 'Interview' },
    { value: 'Introductory Journal Article', text: 'Introductory Journal Article' },
    { value: 'Journal Article', text: 'Journal Article' },
    { value: 'Lectures', text: 'Lectures' },
    { value: 'Legal Cases', text: 'Legal Cases' },
    { value: 'Letter', text: 'Letter' },
    { value: 'Meta-Analysis', text: 'Meta-Analysis' },
    { value: 'Multicenter Study', text: 'Multicenter Study' },
    { value: 'News', text: 'News' },
    { value: 'Observational Study', text: 'Observational Study' },
    { value: 'Patient Education Handout', text: 'Patient Education Handout' },
    { value: 'Personal Narratives', text: 'Personal Narratives' },
    { value: 'Portraits', text: 'Portraits' },
    { value: 'Practice Guideline', text: 'Practice Guideline' },
    { value: 'Pragmatic Clinical Trial', text: 'Pragmatic Clinical Trial' },
    { value: 'Published Erratum', text: 'Published Erratum' },
    { value: 'Randomized Controlled Trial', text: 'Randomized Controlled Trial' },
    { value: 'Review', text: 'Review' },
    { value: 'Twin Study', text: 'Twin Study' },
    { value: 'Validation Studies', text: 'Validation Studies' },
    { value: 'Video-Audio Media', text: 'Video-Audio Media' },
    { value: 'Webcasts', text: 'Webcasts' },
];

export const HERDC_CODES = [
    { value: '450001', text: 'A1 Authored Book (Research)' },
    { value: '450005', text: 'AX Edited Book; Book (Other Public Output)' },
    { value: '450006', text: 'B1 Book Chapter (Research, Critical Review of Research)' },
    { value: '450008', text: 'BX Book Chapter (Other Public Output)' },
    { value: '450009', text: 'C1 Refereed Journal Article (Research, Critical Review of Research)' },
    { value: '450013', text: 'CX Journal Article (Other Public Output)' },
    { value: '450014', text: 'E1 Refereed Conference Paper (Fully Published)' },
    { value: '450018', text: 'EX Conference Paper (Other Public Output)' },
    { value: '454028', text: 'CW1 Creative Work' },
    { value: '454029', text: 'CW2 Live Performance of Creative Work' },
    { value: '454030', text: 'CW3 Recorded or Rendered Creative Work' },
    { value: '454031', text: 'CW4 Curated or Produced Exhibition or Event' },
    { value: '454032', text: 'CW5 Research Report for an External Body' },
];
export const DEPRECATED_HERDC_CODES = [
    { value: '450002', text: 'A2 Books - Authored - other' },
    { value: '450003', text: 'A3 Books - Edited' },
    { value: '450004', text: 'A4 Books - Revision/New Edition' },
    { value: '450043', text: 'B Book Chapter' },
    { value: '450007', text: 'B2 Book Chapter - Other' },
    { value: '450044', text: 'C2 Journal Article - other refereed' },
    { value: '450010', text: 'C3 Journal Articles - Non-refereed' },
    { value: '450011', text: 'C4 Journal Article - Letter or note' },
    { value: '450012', text: 'C5 Edited Volume of a Refereed Journal' },
    { value: '450045', text: 'D Major Review' },
    { value: '450015', text: 'E2 Conference - Full written paper - non-refereed proceedings' },
    { value: '450016', text: 'E3 Conference Publication - Extract of Paper' },
    { value: '450017', text: 'E4 Edited volume of conference proceedings' },
    { value: '450019', text: 'F Audio-Visual Recordings' },
    { value: '450020', text: 'FX Other Public Output' },
    { value: '450046', text: 'G Computer Software' },
    { value: '450021', text: 'G1 Computer Software' },
    { value: '450022', text: 'G2 Computer Database' },
    { value: '450023', text: 'GX Computer - Other Public Output' },
    { value: '450047', text: 'H Technical Drawing/Architectural and Industrial Design/Working Model' },
    { value: '450024', text: 'H1 Refereed Design Awards' },
    { value: '450026', text: 'H2 Design Exhibitions' },
    { value: '450048', text: 'H3 Technical drawing/architectural and industrial design/working model' },
    { value: '450027', text: 'HX Architectural/Building Design - Other Public Output' },
    { value: '450028', text: 'I Patents' },
    { value: '450029', text: 'IX Patents - Other public output' },
    { value: '450030', text: 'J1 Major Creative Works - Published Works' },
    { value: '450031', text: 'J2 Other Creative Works - Minor Written or Recorded Work' },
    { value: '450049', text: 'J3 Major Creative Works - Exhibitions' },
    { value: '450032', text: 'J4 Other Creative Works - Representation of Original Art' },
    { value: '450033', text: 'J5 Major Creative Works - Recorded Works' },
    { value: '450034', text: 'JX Other Creative Works - Other Public Output' },
    { value: '450035', text: 'K Published Research Report' },
    { value: '450036', text: 'K1 Published Research Report' },
    { value: '450037', text: 'K2 Published Government Research Report' },
    { value: '450038', text: 'KX Research Report - Other Public Output' },
    { value: '450039', text: 'L Thesis' },
    { value: '450040', text: 'LX Thesis - Other public output' },
    { value: '450041', text: 'M Reference Entry in Dictionary/Encyclopaedia' },
    { value: '450042', text: 'MX Reference Entry in Dictionary/Encyclopaedia - Other Public Output' },
];

export const HERDC_STATUS = [
    { value: '453220', text: 'Provisional Code' },
    { value: '453221', text: 'Confirmed Code' },
];

export const INSTITUTIONAL_STATUS = [
    { value: '453223', text: 'UQ' },
    { value: '453224', text: 'Non-UQ' },
    { value: '453225', text: 'Unknown' },
];

export const REFEREED_SOURCES = [
    { value: '453638', text: 'Not yet assessed' },
    { value: '453635', text: 'Ulrichs' },
    { value: '453634', text: 'Thomson Reuters' },
    { value: '453632', text: 'ERA Journal List 2012' },
    { value: '453631', text: 'ERA Journal List 2015' },
    { value: '453633', text: 'ERA Journal List 2010' },
    { value: '453636', text: 'Other' },
    { value: '453637', text: 'Not peer reviewed' },
];

export const ALTERNATE_GENRE = [
    { value: '453663', text: 'Conversation' },
    { value: '453664', text: 'Culture, stories, people' },
    { value: '453665', text: 'Session organisation' },
    { value: '453666', text: 'Song' },
    { value: '453667', text: 'Traditional language sentence' },
    { value: '453668', text: 'Traditional language word' },
];

export const OA_STATUS = [
    { value: '453692', text: 'Not yet assessed' },
    { value: '453693', text: 'DOI' },
    { value: '453694', text: 'Link (no DOI)' },
    { value: '453695', text: 'File (Publisher version)' },
    { value: '453696', text: 'File (Author Accepted Manuscript)' },
    { value: '454127', text: 'Preprint' },
    { value: '453697', text: 'Other' },
    { value: '453698', text: 'Not Open Access' },
    { value: '453700', text: 'Mediated Access' },
    { value: '453954', text: 'PMC' },
    { value: '454116', text: 'RDM open' },
    { value: '454118', text: 'Not yet assessed (OpenAlex)' },
];

export const OA_STATUS_TYPE = [
    { value: 454120, text: 'Green' },
    { value: 454121, text: 'Gold' },
    { value: 454122, text: 'Hybrid' },
    { value: 454123, text: 'Bronze' },
    { value: 454124, text: 'Diamond' },
];

export const ALTERNATE_IDENTIFIER_TYPE = [
    { value: 457082, text: 'Serial Number' },
    { value: 457083, text: 'Inventory Number' },
    { value: 457084, text: 'Other' },
];

export const AUTHOR_EXTERNAL_IDENTIFIER_TYPE = [
    { value: 457086, text: 'Orcid' },
    { value: 457087, text: 'ROR' },
];

export const SENSITIVE_HANDLING_NOTE_OTHER_TYPE = 456860;
export const SENSITIVE_HANDLING_NOTE_TYPE = [
    {
        value: 456855,
        text: 'Indigenous/First Nations people should be aware that this output contains images, voices and/or names of deceased persons.',
    },
    {
        value: 456856,
        text: 'Indigenous/First Nations people should be aware that this output is about women’s business.',
    },
    {
        value: 456857,
        text: 'Indigenous/First Nations people should be aware that this output is about men’s business.',
    },
    {
        value: 456858,
        text:
            'Assessors should be aware that this output contains content related to any of the following: violence, ' +
            'family or domestic violence, self-harm, sexual assault, suicide, family child removal, refugee experiences, ' +
            'war survivor experiences or other traumatic experiences that may be distressing or harmful to some people.',
    },
    {
        value: 456859,
        text:
            'Assessors should be aware that this output contains content with explicit language, hate speech, nudity or ' +
            'sexuality, or drug use which may be confronting and potentially distressing to some people.',
    },
    {
        value: SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
        text: 'Other',
    },
];

export const ANDS_COLLECTION_TYPE_COLLECTION = 453615;
export const ANDS_COLLECTION_TYPE_DATASET = 453616;
export const ANDS_COLLECTION_TYPE_OPTIONS = [
    {
        value: ANDS_COLLECTION_TYPE_COLLECTION,
        text: 'Collection',
    },
    {
        value: ANDS_COLLECTION_TYPE_DATASET,
        text: 'Dataset',
    },
];

export const CAPPED_OPTIONS = [
    { value: 'Y', text: 'Y' },
    { value: 'Approaching', text: 'Approaching' },
    { value: 'Exceeded', text: 'Exceeded' },
    { value: 'Nodeal', text: 'No deal' },
    { value: 'N', text: 'N' },
];

export const S2O_OPTIONS = [
    { value: 'Y', text: 'Y' },
    { value: 'S2O', text: 'S2O' },
    { value: 'N', text: 'N' },
];

export const BOOLEAN_OPTIONS = [
    { value: true, text: 'Y' },
    { value: false, text: 'N' },
];

export const AFFILIATION_TYPE_NOT_UQ = 'NotUQ';
export const AFFILIATION_TYPE_UQ = 'UQ';

export const DOI_CROSSREF_NAME = 'Crossref';
export const DOI_CROSSREF_PREFIX = '10.14264';
export const DOI_DATACITE_NAME = 'DataCite';
export const DOI_DATACITE_PREFIX = IS_PRODUCTION ? '10.48610' : '10.23643';

export const PLACEHOLDER_ISO8601_ZULU_DATE = '1000-01-01T00:00:00Z';
export const PLACEHOLDER_ISO8601_DATE = '1000-01-01 00:00:00';

export const THESIS_UPLOAD_RETRIES = 5;

export const PUB_SEARCH_BULK_EXPORT_SIZE = 500;
export const COMMUNITY_COLLECTION_BULK_EXPORT_SIZE = 500;
export const MY_RECORDS_BULK_EXPORT_SIZE = 1000;
export const PUB_LIST_BULK_EXPORT_SIZES = [PUB_SEARCH_BULK_EXPORT_SIZE, MY_RECORDS_BULK_EXPORT_SIZE];

export const EDITORIAL_ROLE_ASSOCIATE_EDITOR = '454140';
export const EDITORIAL_ROLE_DEPUTY_EDITOR = '454141';
export const EDITORIAL_ROLE_EDITOR = '454142';
export const EDITORIAL_ROLE_EDITOR_IN_CHIEF = '454143';
export const EDITORIAL_ROLE_EDITORIAL_BOARD_MEMBER = '454144';
export const EDITORIAL_ROLE_GUEST_EDITOR = '454145';
export const EDITORIAL_ROLE_SECTION_EDITOR = '454146';
export const EDITORIAL_ROLE_SINGLE_ISSUE_EDITOR = '454147';
export const EDITORIAL_ROLE_OTHER = '454148';

export const EDITORIAL_ROLE_OPTIONS = [
    { value: EDITORIAL_ROLE_ASSOCIATE_EDITOR, text: 'Associate Editor' },
    { value: EDITORIAL_ROLE_DEPUTY_EDITOR, text: 'Deputy Editor' },
    { value: EDITORIAL_ROLE_EDITOR, text: 'Editor' },
    { value: EDITORIAL_ROLE_EDITOR_IN_CHIEF, text: 'Editor-in-Chief' },
    { value: EDITORIAL_ROLE_EDITORIAL_BOARD_MEMBER, text: 'Editorial Board Member' },
    { value: EDITORIAL_ROLE_GUEST_EDITOR, text: 'Guest Editor' },
    { value: EDITORIAL_ROLE_SECTION_EDITOR, text: 'Section Editor' },
    { value: EDITORIAL_ROLE_SINGLE_ISSUE_EDITOR, text: 'Single Issue Editor' },
    { value: EDITORIAL_ROLE_OTHER, text: 'Other' },
];

export const EDITORIAL_ROLE_MAP = {
    [EDITORIAL_ROLE_ASSOCIATE_EDITOR]: 'Associate Editor',
    [EDITORIAL_ROLE_DEPUTY_EDITOR]: 'Deputy Editor',
    [EDITORIAL_ROLE_EDITOR]: 'Editor',
    [EDITORIAL_ROLE_EDITOR_IN_CHIEF]: 'Editor-in-Chief',
    [EDITORIAL_ROLE_EDITORIAL_BOARD_MEMBER]: 'Editorial Board Member',
    [EDITORIAL_ROLE_GUEST_EDITOR]: 'Guest Editor',
    [EDITORIAL_ROLE_SECTION_EDITOR]: 'Section Editor',
    [EDITORIAL_ROLE_SINGLE_ISSUE_EDITOR]: 'Single Issue Editor',
    [EDITORIAL_ROLE_OTHER]: 'Other',
};
export const EDITORIAL_APPOINTMENT_MIN_YEAR = 1900;
export const EDITORIAL_APPOINTMENT_MAX_YEAR = 2100;

export const OPEN_ACCESS_ID = 453619;
export const MEDIATED_ACCESS_ID = 453618;
export const DATASET_ACCESS_CONDITIONS_OPTIONS = [
    {
        value: OPEN_ACCESS_ID,
        text: 'Open Access',
    },
    {
        value: MEDIATED_ACCESS_ID,
        text: 'Mediated Access',
    },
];

export const AV_CHECK_STATE_DEFAULT = 'default';
export const AV_CHECK_STATE_CLEAN = 'clean';
export const AV_CHECK_STATE_INFECTED = 'infected';
export const AV_CHECK_STATE_UNSCANNABLE = 'unscannable';
export const AV_CHECK_STATES = [AV_CHECK_STATE_CLEAN, AV_CHECK_STATE_INFECTED, AV_CHECK_STATE_UNSCANNABLE];

export const BULK_DELETE_USER_SUCCESS = 'User deleted';
export const BULK_DELETE_USER_NOT_FOUND = 'User not found';
export const BULK_DELETE_USER_PREMIS_EVENT = 'Cannot delete user with premis events';

export const BULK_DELETE_AUTHOR_SUCCESS = 'Author deleted';
export const BULK_DELETE_AUTHOR_NOT_FOUND = 'Author not found';
export const BULK_DELETE_AUTHOR_LINKED_WORKS = 'Cannot delete author with linked works';

export const SCOPUS_INGESTED_AUTHORS = 'SCOPUS_INGESTED_AUTHORS';

export const COLLECTION_VIEW_TYPE = [
    { id: 456849, value: 'auto', label: 'Auto' },
    { id: 456850, value: 'standard', label: 'Standard' },
    { id: 456851, value: 'image-gallery', label: 'Image Gallery' },
];

/** journalAdmin  */
export const ADMIN_JOURNAL = 'adminjournal';

/** journalSearch  */
export const JOURNAL_SEARCH_OPERANDS = ['OR', 'AND', 'NOT'];

/** Links */
export const dataTeamCollections = ['UQ:06510ce'];

/** read only controlled vocabularies (hard coded above) */
const READONLY_VOCABS_IDS = [
    453607, 453982, 453991, 453995, 453596, 454089, 454025, 450000, 453219, 453222, 453630, 453691, 454119, 456854,
    454139, 453617, 453614, 456851, 456849, 456850, 453662,
];
export const isReadonlyVocab = id => READONLY_VOCABS_IDS.includes(id);
