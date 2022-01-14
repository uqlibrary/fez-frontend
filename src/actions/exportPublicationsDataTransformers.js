import FileSaver from 'file-saver';
import locale from 'locale/components';
import moment from 'moment';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

export const getExceptionMessage = format => `Export format ${format} is not supported.`;

/**
 * Return a export filename ie. espace_export_<datetime>.xlsx
 *
 * @param format
 * @return {string}
 */
export const getFileName = extension =>
    `${locale.components.export.filename.prefix}_${moment()
        .clone()
        .format(locale.components.export.filename.dateFormat)}.${extension}`;

/**
 * For a given response data that should be treated as binary, trigger a file download dialog
 *
 * @param {string} format
 * @param {Object} response - binary data response
 * @returns void
 */
export function promptForDownload(format, response) {
    if (!(format in EXPORT_FORMAT_TO_EXTENSION)) {
        throw new Error(getExceptionMessage(format));
    }

    FileSaver.saveAs(response, getFileName(EXPORT_FORMAT_TO_EXTENSION[format]));
}
