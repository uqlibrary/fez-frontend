// authors and accounts apis
export const ACCOUNT_API = 'account';
export const AUTHORS_SEARCH_API = 'fez-authors/search?query=[query]';
export const CURRENT_AUTHOR_API = 'fez-authors';
export const AUTHOR_DETAILS_API = 'authors/details/[userId]';

// academic stats apis
export const ACADEMIC_STATS_PUBLICATION_YEARS_API = 'academic/[userId]/publication-years';
export const ACADEMIC_STATS_PUBLICATION_HINDEX_API = 'academic/[userId]/hindex';
export const ACADEMIC_STATS_PUBLICATION_STATS_API = 'academic/[userId]/publication-stats';
export const ACADEMIC_STATS_PUBLICATIONS_TRENDING_API = 'academic/[userId]/trending_publications';

// lookup apis
export const GET_ACML_QUICK_TEMPLATES_API = 'acml/quick-templates';
export const VOCABULARIES_API  = 'vocabularies/[id]';
export const GET_PUBLICATION_TYPES_API = 'records/types';

// file uploading apis
export const FILE_UPLOAD_API = 'file/upload/presigned/[pid]/[fileName]';

// records apis
export const RECORDS_API = 'records';

export const POST_CLAIM_POSSIBLE_PUBLICATIONS_API = 'records';

export const HIDE_POSSIBLE_RECORD_API = 'records/search?rule=possible'; // (with data: [\'pid\' => \'UQ:1\', \'type\' => \'H\'])';
export const POSSIBLE_RECORDS_API = 'records/search?rule=possible&[facets]';
export const CURRENT_USER_RECORDS_API = 'records/search?rule=mine&page=[page]&per_page=[per_page]&sort=[sort]&order_by=[order_by]&[facets]'; //

export const SEARCH_INTERNAL_RECORDS_API = 'records/search?';
export const SEARCH_EXTERNAL_BY_TITLE_API = 'external/records/search?source=[source]&title=[title]';
export const SEARCH_EXTERNAL_BY_DOI_API = 'external/records/search?source=[source]&id=[title]';
export const SEARCH_EXTERNAL_BY_PUBMED_API = 'external/records/search?source=[source]&id=[title]';

export const POST_ISSUE = 'issues';
