import fileDownload from 'js-file-download';

/**
 * File type to name map
 *
 * Note: unfortunately content-disposition info doesn't seem to come through even after whitelisting it on CORS
 *
 * @type {{"application/vnd.ms-excel": string, "application/vnd.endnote": string}}
 */
export const formatToFileInfoMap = {
    'excel': {
        'mimeType': 'application/vnd.ms-excel',
        'filename': 'excel.xls'
    },
    'endnote': {
        'mimeType': 'application/vnd.endnote',
        'filename': 'endnote.enw'
    }
};

/**
 * For a given response data that should be treated as binary, trigger a file download dialog
 *
 * @param {Object} data - binary data response
 * @returns void
 */
export function promptForDownload(format, response) {
    if (!(format in formatToFileInfoMap)) {
        throw `Export format ${format} is not supported.`;
    }

    const fileInfo = formatToFileInfoMap[format];
    fileDownload(response, fileInfo.filename, fileInfo.mimeType);
}

