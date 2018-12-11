import locale from 'locale/components';
const converter = require('number-to-words');

const getValue = (value) => (
    typeof(value) !== 'undefined' && !!value ? value : null
);

export const numberToWords = (value) => {
    const ordinal = converter.toWordsOrdinal(value);
    return ordinal.charAt(0).toUpperCase() + ordinal.slice(1);
};

// Authentication
export const SESSION_COOKIE_NAME = 'UQLID';
export const SESSION_USER_GROUP_COOKIE_NAME = 'UQLID_USER_GROUP';
export const TOKEN_NAME = 'X-Uql-Token';
export const BASE_DN = 'ou=Staff,ou=People,o=The University of Queensland,c=AU';

// URLS - values are set in webpack build
export const API_URL = getValue(process.env.API_URL) || 'https://api.library.uq.edu.au/staging/';
export const APP_URL = getValue(process.env.APP_URL) || 'https://fez-staging.library.uq.edu.au/';

export const AUTH_URL_LOGIN = getValue(process.env.AUTH_LOGIN_URL) || 'https://fez-staging.library.uq.edu.au/login.php';
export const AUTH_URL_LOGOUT = getValue(process.env.AUTH_LOGOUT_URL) || 'https://auth.library.uq.edu.au/logout';

export const ORCID_BASE_URL = getValue(process.env.ORCID_URL) || 'http://orcid.org';
export const ORCID_CLIENT_ID = getValue(process.env.ORCID_CLIENT_ID) || '12345XYZ';
export const ORCID_AUTHORIZATION_URL = `${ORCID_BASE_URL}/oauth/authorize`;

export const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBHRh9tvaGojdXLq3dnNV3O95LIWGXzznc&v=3.exp&libraries=geometry,drawing,places';

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

export const MAX_PUBLIC_SEARCH_TEXT_LENGTH = 500;

export const NTRO_SUBTYPE_OCW_DESIGN_ARCHITECTURAL_WORK = 'Original Creative Work - Design/Architectural Work';
export const NTRO_SUBTYPE_OCW_TEXTUAL_WORK = 'Original Creative Work - Textual Work';
export const NTRO_SUBTYPE_OCW_VISUAL_WORK = 'Original Creative Work - Visual Work';
export const NTRO_SUBTYPE_OCW_MUSICAL_COMPOSITION = 'Original Creative Work - Musical Composition';
export const NTRO_SUBTYPE_OCW_OTHER = 'Original Creative Work - Other';
export const NTRO_SUBTYPE_LP_MUSIC = 'Live Performance - Music';
export const NTRO_SUBTYPE_LP_DANCE = 'Live Performance - Dance';
export const NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE = 'Live Performance - Plays/Dramas/Theatre';
export const NTRO_SUBTYPE_LP_INTERARTS = 'Live Performance - Interarts';
export const NTRO_SUBTYPE_LP_OTHER = 'Live Performance - Other';
export const NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE = 'Recorded or Rendered Work - Music, Dance, Theatre';
export const NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING = 'Recorded or Rendered Work - Audio/Visual Recording';
export const NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS = 'Recorded or Rendered Work - Digital Creative Works';
export const NTRO_SUBTYPE_RRW_INTERARTS = 'Recorded or Rendered Work - Interarts';
export const NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION = 'Recorded or Rendered Work - Website/Exhibition';
export const NTRO_SUBTYPE_RRW_OTHER = 'Recorded or Rendered Work - Other';
export const NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT = 'Curated or Produced Exhibition or Event - Exhibition or Event';
export const NTRO_SUBTYPE_CPEE_FESTIVAL = 'Curated or Produced Exhibition or Event - Festival';
export const NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION = 'Curated or Produced Exhibition or Event - Web Based Exhibition';
export const NTRO_SUBTYPE_CPEE_OTHER = 'Curated or Produced Exhibition or Event - Other Exhibition or Event (Scholarly Disciplines)';
export const NTRO_SUBTYPE_RREB_PUBLIC_SECTOR = 'Research Report for an External Body - Public Sector';
export const NTRO_SUBTYPE_RREB_INDUSTRY = 'Research Report for an External Body - Industry';
export const NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT = 'Research Report for an External Body - Not-for-profit';
export const NTRO_SUBTYPE_RREB_OTHER = 'Research Report for an External Body - Other';
export const NTRO_SUBTYPE_RR_INTERNAL_OTHER = 'Research Report - Internal or Other';

export const CREATIVE_WORK_NTRO_SUBTYPES = [
    NTRO_SUBTYPE_OCW_DESIGN_ARCHITECTURAL_WORK,
    NTRO_SUBTYPE_OCW_TEXTUAL_WORK,
    NTRO_SUBTYPE_OCW_VISUAL_WORK,
    NTRO_SUBTYPE_OCW_MUSICAL_COMPOSITION,
    NTRO_SUBTYPE_OCW_OTHER,
    NTRO_SUBTYPE_LP_MUSIC,
    NTRO_SUBTYPE_LP_DANCE,
    NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
    NTRO_SUBTYPE_LP_INTERARTS,
    NTRO_SUBTYPE_LP_OTHER,
    NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
    NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
    NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
    NTRO_SUBTYPE_RRW_INTERARTS,
    NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
    NTRO_SUBTYPE_RRW_OTHER,
    NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
    NTRO_SUBTYPE_CPEE_FESTIVAL,
    NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION,
    NTRO_SUBTYPE_CPEE_OTHER,
];

export const RESEARCH_REPORT_NTRO_SUBTYPES = [
    NTRO_SUBTYPE_RREB_PUBLIC_SECTOR,
    NTRO_SUBTYPE_RREB_INDUSTRY,
    NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT,
    NTRO_SUBTYPE_RREB_OTHER,
    NTRO_SUBTYPE_RR_INTERNAL_OTHER,
];

export const NTRO_SUBTYPES = [
    ...CREATIVE_WORK_NTRO_SUBTYPES,
    ...RESEARCH_REPORT_NTRO_SUBTYPES
];

export const publicationTypes = (components) => [
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
        id: PUBLICATION_TYPE_GENERIC_DOCUMENT,
        name: 'Generic Document',
        class: 'Uqlibrary\\FezCore\\Types\\Generic',
        formComponent: components ? components.GenericDocumentForm : null,
        citationComponent: components ? components.GenericDocumentCitation : null,
        hasFormComponent: true
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

export const documentTypesLookup = {
    202: 'Generic document',
    263: 'Audio document',
    174: 'Book',
    177: 'Book chapter',
    130: 'Conference paper',
    197: 'Conference proceedings',
    313: 'Creative work',
    371: 'Data collection',
    181: 'Department technical report',
    316: 'Design',
    228: 'Digilib image',
    238: 'Image',
    294: 'Journal',
    179: 'Journal article',
    374: 'Manuscript',
    191: 'Newspaper article',
    185: 'Patent',
    204: 'Preprint',
    275: 'Research report',
    189: 'Seminar paper',
    187: 'Thesis',
    310: 'Video document',
    183: 'Working paper',
    272: 'Reference entry'
};

export const publicationSubtypes = [
    'Research book (original research)',
    'Textbook',
    'Edited book',
    'Reference work, encyclopaedia, manual or handbook',
    'Research book chapter (original research)',
    'Critical review of research, literature review, critical commentary',
    'Chapter in textbook',
    'Chapter in reference work, encyclopaedia, manual or handbook',
    'Introduction, foreword, editorial or appendix',
    'Conference paper',
    'Fully published paper',
    'Published abstract',
    'Poster',
    'Oral presentation',
    'Article (original research)',
    'Critical review of research, literature review, critical commentary',
    'Letter to editor, brief commentary or brief communication',
    'Correction/erratum',
    'Review of book, film, TV, video, software, performance, music etc',
    'Editorial',
    'Discussion - responses, round table/panel discussions, Q&A, reply',
    'Creative work',
    'Other',
];

export const QuickTemplates = {
    UQ_STAFF_STUDENTS_VIEW: 1,
    UQ_STAFF_STUDENTS_PRINTERY_VIEW: 6,
    INHERIT_FROM_ABOVE: 7,
    CLOSED_ACCESS_ID: 8,
    OPEN_ACCESS_ID: 9,
};

export const thesisSubtypes = [
    {value: 'B.A. Thesis', label: 'B.A. Thesis'},
    {value: 'B.Sc Thesis', label: 'B.Sc Thesis'},
    {value: 'Bachelor\'s Thesis', label: 'Bachelor\'s Thesis'},
    {value: 'Higher Doctorate', label: 'Higher Doctorate'},
    {value: 'Honours Thesis', label: 'Honours Thesis'},
    {value: 'M.A. Thesis', label: 'M.A. Thesis'},
    {value: 'M.Sc Thesis', label: 'M.Sc Thesis'},
    {value: 'Master\'s Thesis', label: 'Master\'s Thesis'},
    {value: 'MPhil Thesis', label: 'MPhil Thesis'},
    {value: 'Other', label: 'Other'},
    {value: 'PhD Thesis', label: 'PhD Thesis'},
    {value: 'Professional Doctorate', label: 'Professional Doctorate'}
];

export const thesisSubmissionSubtypes = [
    'MPhil Thesis',
    'PhD Thesis',
    'Professional Doctorate'
];

/**
 * File type to name map
 */
export const exportFormatToExtension = {
    'excel': 'xlsx',
    'endnote': 'enw'
};

export const OrgUnitsVocabId = 453703;
export const FieldOfResearchVocabId = 451780;

// Default values for createNewRecord
export const NEW_RECORD_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 2,
    fez_record_search_key_ismemberof: [
        {
            rek_ismemberof: 'UQ:218198',
            rek_ismemberof_order: 1
        }
    ]
};

export const NEW_DATASET_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 3,
    rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
    fez_record_search_key_ismemberof: [
        {
            rek_ismemberof: 'UQ:289097',
            rek_ismemberof_order: 1
        }
    ]
};

export const HDR_THESIS_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 3,
    fez_record_search_key_ismemberof: [
        {rek_ismemberof: 'UQ:152694'}
    ],
    rek_display_type: PUBLICATION_TYPE_THESIS,
    fileAccessId: 3
};

export const SBS_THESIS_DEFAULT_VALUES = {
    rek_object_type: 3,
    rek_status: 3,
    fez_record_search_key_ismemberof: [
        {rek_ismemberof: 'UQ:155729'}
    ],
    rek_display_type: PUBLICATION_TYPE_THESIS,
    rek_genre_type: 'Professional Doctorate',
    fileAccessId: 4
};

export const defaultQueryParams = {
    page: 1,
    pageSize: 20,
    sortBy: locale.components.sorting.sortBy[1].value,
    sortDirection: locale.components.sorting.sortDirection[0],
    activeFacets: {
        filters: {},
        ranges: {}
    }
};

export const DATA_COLLECTION_CREATOR_ROLES = [
    {value: 'Project lead/Principal investigator'},
    {value: 'Co-investigator'},
    {value: 'Higher degree research student'},
    {value: 'Research assistant'},
    {value: 'Software engineer'},
    {value: 'Statistician'},
    {value: 'Technician'}
];

export const CLOSED_ACCESS_ID = 453619;
export const MEDIATED_ACCESS_ID = 453618;
export const licenses = [
    {
        value: 453608,
        text: 'Creative Commons Attribution (only) http://creativecommons.org/licenses/by/3.0/deed.en_US'
    },
    {
        value: 453609,
        text: 'Creative Commons Attribution no derivatives http://creativecommons.org/licenses/by-nd/3.0/deed.en_US'
    },
    {
        value: 453610,
        text: 'Creative Commons Attribution noncommercial http://creativecommons.org/licenses/by-nc/3.0/deed.en_US'
    },
    {
        value: 453611,
        text: 'Creative Commons Attribution noncommercial no derivatives http://creativecommons.org/licenses/by-nc-nd/3.0/deed.en_US'
    },
    {
        value: 453612,
        text: 'Creative Commons Attribution noncommercial share alike http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US '
    },
    {
        value: 453613,
        text: 'Creative Commons Attribution share alike http://creativecommons.org/licenses/by-sa/3.0/deed.en_US'
    },
    {
        value: 453701,
        text: 'UQ Terms & Conditions Permitted Re-use with Acknowledgement Licence http://guides.library.uq.edu.au/deposit_your_data/terms_and_conditions'
    },
    {
        value: 453702,
        text: 'UQ Terms & Conditions Permitted Non-commercial Re-use with Acknowledge Licence http://guides.library.uq.edu.au/deposit_your_data/terms_and_conditions'
    }
];

export const orgAffiliationTypes = [
    {
        value: 453983,
        text: 'Museum'
    },
    {
        value: 453984,
        text: 'Gallery'
    },
    {
        value: 453985,
        text: 'Government'
    },
    {
        value: 453986,
        text: 'NGO'
    },
    {
        value: 453987,
        text: 'Foundation'
    },
    {
        value: 453988,
        text: 'Corporate/Industry'
    },
    {
        value: 453989,
        text: 'University'
    },
    {
        value: 453990,
        text: 'Other'
    }
];
