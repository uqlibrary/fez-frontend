import FileSaver from 'file-saver';

/**
 * File type to name map
 *
 * Note: unfortunately content-disposition info doesn't seem to come through even after whitelisting it on CORS
 *
 * @type {{"application/vnd.ms-excel": string, "application/vnd.endnote": string}}
 */
export const formatToFilenameMap = {
    'excel': 'excel.xls',
    'endnote': 'endnote.enw'
};

/**
 * For a given response data that should be treated as binary, trigger a file download dialog
 *
 * @param {Object} data - binary data response
 * @returns void
 */
export function promptForDownload(format, response) {
    if (!(format in formatToFilenameMap)) {
        throw `Export format ${format} is not supported.`;
    }

    FileSaver.saveAs(response, formatToFilenameMap[format]);
}

