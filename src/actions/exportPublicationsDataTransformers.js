import FileSaver from 'file-saver';
import locale from '../locale/components';
import moment from 'moment';

/**
 * File type to name map
 *
 * Note: unfortunately content-disposition info doesn't seem to come through even after whitelisting it on CORS
 *
 * @type {{"application/vnd.ms-excel": string, "application/vnd.endnote": string}}
 */
export const formatToExtensionMap = {
    'excel': 'xlsx',
    'endnote': 'enw'
};

export const getExceptionMessage = (format) => `Export format ${format} is not supported.`;

/**
 * Return a export filename ie. espace_export_<datetime>.xlsx
 *
 * @param format
 * @return {string}
 */
export const getFileName = (extension) =>
    `${locale.components.export.filename.prefix}_${moment().clone().format(locale.components.export.filename.dateFormat)}.${extension}`;

/**
 * For a given response data that should be treated as binary, trigger a file download dialog
 *
 * @param {Object} data - binary data response
 * @returns void
 */
export function promptForDownload(format, response) {
    if (!(format in formatToExtensionMap)) {
        throw getExceptionMessage(format);
    }

    FileSaver.saveAs(response, getFileName(formatToExtensionMap[format]));
}

