export const CLOSED_ACCESS_ID = 8;
export const OPEN_ACCESS_ID = 9;
export const SIZE_BASE = 1000;

export const DEFAULT_FILE_UPLOAD_LIMIT = 10;
export const DEFAULT_MAX_FILE_SIZE = 8;

export const SIZE_UNIT_B = 'B';
export const SIZE_UNIT_K = 'K';
export const SIZE_UNIT_M = 'M';
export const SIZE_UNIT_G = 'G';

export const FILE_META_KEY_ACCESS_CONDITION = 'access_condition_id';
export const FILE_META_KEY_EMBARGO_DATE = 'date';

export const SIZE_UNITS = [SIZE_UNIT_B, SIZE_UNIT_K, SIZE_UNIT_M, SIZE_UNIT_G];

export const FILE_NAME_RESTRICTION = /^(?=^\S*$)(?=^[a-z\d\-_]+(\.\d{3}|\.r\d{2,3}|\.part\d{1,3})?\.[^\.]+$)(?=.{1,45}$)(?!(web_|preview_|thumbnail_|stream_|fezacml_|presmd_|\d))[a-z\d\-_\.]+/;

/**
 * Note: ext -> mimetype is a 1-n relation, but we only care about one value
 */
export const MIME_TYPE_WHITELIST = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    tiff: 'image/tiff',
    png: 'image/png',
    zip: 'application/zip',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    '7z': 'application/x-7z-compressed',
    rar: 'application/x-rar-compressed',
    mkv: 'video/x-matroska',
    mov: 'video/quicktime',
    mp4: 'video/mp4',
    mp3: 'audio/mp3',
    wav: 'audio/wav',
    mpg: 'video/mpeg',
    wmv: 'video/x-ms-wmv',
    wma: 'audio/x-ms-wma',
    avi: 'video/x-msvideo',
    m4a: 'audio/x-m4a',
    csv: 'text/csv',
    xls: 'application/vnd.ms-excel',
    xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
    xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    gsheet: 'application/vnd.google-apps.spreadsheet',
};
