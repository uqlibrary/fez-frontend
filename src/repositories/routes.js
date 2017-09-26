export const GET_ACCOUNT_API = 'account';
export const GET_AUTHORS_SEARCH_API = 'fez-authors/search';
export const GET_CURRENT_AUTHOR_API = 'fez-authors';
export const GET_AUTHOR_DETAILS_API = 'authors/details';

export const GET_ACADEMIC_PUBLICATION_YEARS = 'academic/[userId]/publication-years';
export const GET_ACADEMIC_PUBLICATION_HINDEX = 'academic/[userId]/hindex';
export const GET_ACADEMIC_PUBLICATION_STATS = 'academic/[userId]/publication-stats';
export const GET_ACADEMIC_PUBLICATIONS_TRENDING = 'academic/[username]/trending_publications';

export const GET_ACML_QUICK_TEMPLATES_API = 'acml/quick-templates';
export const GET_VOCABULARIES_API = 'vocabularies';
export const GET_PUBLICATION_TYPES_API = 'records/types';

export const GET_FILE_UPLOAD_API = 'file/upload/presigned';

// records api routes
export const RECORDS_API = 'records';

export const POST_CLAIM_POSSIBLE_PUBLICATIONS_API = 'records';

export const HIDE_POSSIBLE_RECORD_API = 'records/search?rule=possible'; // (with data: [\'pid\' => \'UQ:1\', \'type\' => \'H\'])';
export const POSSIBLE_RECORDS_API = 'records/search?rule=possible'; //
export const CURRENT_USER_RECORDS_API = 'records/search?rule=mine'; //

export const SEARCH_INTERNAL_RECORDS_API = 'records/search?';
export const SEARCH_EXTERNAL_BY_TITLE_API = 'external/records/search?source=[source]&title=[title]';
export const SEARCH_EXTERNAL_BY_DOI_API = 'external/records/search?source=[source]&id=[title]';
export const SEARCH_EXTERNAL_BY_PUBMED_API = 'external/records/search?source=[source]&id=[title]';

export const POST_ISSUE = 'issues';




