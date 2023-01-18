import { viewRecordsConfig } from '../config';
import { STATE_DELETED } from '../config/viewRecord';
import { sanitiseId, stripHtml } from './general';
import { isSensitiveHandlingNoteTypeOther } from '../modules/SharedComponents/SensitiveHandlingNote/containers/SensitiveHandlingNoteField';
import { SENSITIVE_HANDLING_NOTE_TYPE } from '../config/general';

export const generatePKString = (pid, filename) => sanitiseId(`${pid}-${filename}`);

export const isDerivative = dataStream => {
    const {
        files: { blacklist },
    } = viewRecordsConfig;

    const fileName = dataStream.dsi_dsid;

    return !!(fileName.match(blacklist.namePrefixRegex) || fileName.match(blacklist.nameSuffixRegex));
};

export const isAdded = datastream => {
    return datastream.dsi_state !== STATE_DELETED;
};

/**
 * @param record
 */
export const getAdvisoryStatement = (record, _default) => {
    // eslint-disable-next-line camelcase
    const value = record?.fez_record_search_key_advisory_statement?.rek_advisory_statement;
    return value ? stripHtml(value) : stripHtml(_default);
};

/**
 * @param record
 */
export const getSensitiveHandlingNote = record =>
    isSensitiveHandlingNoteTypeOther(
        record.fez_record_search_key_sensitive_handling_note_id.rek_sensitive_handling_note_id,
    ) &&
    // eslint-disable-next-line camelcase
    !!record.fez_record_search_key_sensitive_handling_note_other?.rek_sensitive_handling_note_other
        ? record.fez_record_search_key_sensitive_handling_note_other.rek_sensitive_handling_note_other
        : SENSITIVE_HANDLING_NOTE_TYPE.find(
              item =>
                  item.value === record.fez_record_search_key_sensitive_handling_note_id.rek_sensitive_handling_note_id,
          )?.text;
