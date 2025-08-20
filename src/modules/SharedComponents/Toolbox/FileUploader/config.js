export const FILE_ACCESS_CONDITION_CLOSED = 1;
export const FILE_ACCESS_CONDITION_OPEN = 5;
export const FILE_ACCESS_CONDITION_INHERIT = 99;
export const FILE_SECURITY_POLICY_ADMIN = 1;
export const FILE_SECURITY_POLICY_EVIDENCE_ASSESSORS = 3;
export const FILE_SECURITY_POLICY_PUBLIC = 5;

export const FILE_ACCESS_OPTIONS = [
    { text: 'Open Access', value: FILE_ACCESS_CONDITION_OPEN },
    { text: 'Closed Access', value: FILE_ACCESS_CONDITION_CLOSED },
];

export const INHERIT_OPTION = {
    text: 'Inherit from parent collection',
    value: FILE_ACCESS_CONDITION_INHERIT,
};

export const SIZE_BASE = 1000;

export const DEFAULT_FILE_UPLOAD_LIMIT = 10;
export const DEFAULT_MAX_FILE_SIZE = 5;

export const SIZE_UNIT_B = 'B';
export const SIZE_UNIT_K = 'K';
export const SIZE_UNIT_M = 'M';
export const SIZE_UNIT_G = 'G';

export const FILE_META_KEY_ACCESS_CONDITION = 'access_condition_id';
export const FILE_META_KEY_EMBARGO_DATE = 'date';
export const FILE_META_KEY_DESCRIPTION = 'description';
export const FILE_META_KEY_SECURITY_POLICY = 'security_policy';

export const SIZE_UNITS = [SIZE_UNIT_B, SIZE_UNIT_K, SIZE_UNIT_M, SIZE_UNIT_G];

export const FILE_NAME_RESTRICTION =
    /^(?=^\S*$)(?=^[a-z\d\-_]+(\.\d{3}|\.r\d{2,3}|\.part\d{1,3})?\.[^\.]+$)(?=.{1,45}$)(?!(web_|preview_|thumbnail_|stream_|fezacml_|presmd_|\d))[a-z\d\-_\.]+/;

/**
 * When updating the following list, please make sure to update it as well in the following projects:
 * - https://github.com/uqlibrary/fez-frontend
 * - https://github.com/uqlibrary/lambda-fez-upload-handler-trigger
 * - https://github.com/uqlibrary/api
 * - https://github.com/uqlibrary/fez
 *
 * Note: ext -> mimetype is a 1-n relation, but we only care about one value
 */
export const MIME_TYPE_WHITELIST = {
    pdf: 'application/pdf',
    jpe: 'image/jpeg',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    png: 'image/png',
    zip: 'application/zip',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    '7z': 'application/x-7z-compressed',
    rar: 'application/x-rar-compressed',
    mk3d: 'video/x-matroska',
    mks: 'video/x-matroska',
    mkv: 'video/x-matroska',
    qt: 'video/quicktime',
    mov: 'video/quicktime',
    mp4: 'video/mp4',
    mp4v: 'video/mp4',
    mp3: 'audio/mp3',
    mxf: 'application/mxf',
    wav: 'audio/wav',
    mpe: 'video/mpeg',
    mpeg: 'video/mpeg',
    mpg: 'video/mpeg',
    m1v: 'video/mpeg',
    m2v: 'video/mpeg',
    wmv: 'video/x-ms-wmv',
    wma: 'audio/x-ms-wma',
    avi: 'video/x-msvideo',
    m4a: 'audio/x-m4a',
    csv: 'text/csv',
    xla: 'application/vnd.ms-excel',
    xlc: 'application/vnd.ms-excel',
    xlm: 'application/vnd.ms-excel',
    xls: 'application/vnd.ms-excel',
    xlt: 'application/vnd.ms-excel',
    xlw: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    gsheet: 'application/vnd.google-apps.spreadsheet',
};
