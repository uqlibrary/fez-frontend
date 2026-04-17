import { viewRecordsConfig } from '../config';
import { STATE_DELETED } from '../config/viewRecord';
import {
    AV_CHECK_STATE_DEFAULT,
    AV_CHECK_STATES,
    SENSITIVE_HANDLING_NOTE_TYPE,
    SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
} from '../config/general';
import { locale } from '../locale';
import { UTCDateToCurrentTZDate } from '../modules/SharedComponents/Toolbox/FileAvStateIcon/FileAvStateIcon';

export const isSensitiveHandlingNoteTypeOther = value => parseInt(value, 10) === SENSITIVE_HANDLING_NOTE_OTHER_TYPE;

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
export const getSensitiveHandlingNote = record =>
    isSensitiveHandlingNoteTypeOther(
        record.fez_record_search_key_sensitive_handling_note_id.rek_sensitive_handling_note_id,
    ) && !!record.fez_record_search_key_sensitive_handling_note_other?.rek_sensitive_handling_note_other
        ? record.fez_record_search_key_sensitive_handling_note_other.rek_sensitive_handling_note_other
        : SENSITIVE_HANDLING_NOTE_TYPE.find(
              item =>
                  item.value === record.fez_record_search_key_sensitive_handling_note_id.rek_sensitive_handling_note_id,
          )?.text;

/**
 * @param state
 * @return string
 */
export const getAvState = state => (AV_CHECK_STATES.includes(state) ? state : AV_CHECK_STATE_DEFAULT);

/**
 * @param state
 * @param checkedAt
 * @return string
 */
export const getAvStateDescription = (state, checkedAt) =>
    locale.components.fileAvStateIcon.description.map[getAvState(state)]?.(UTCDateToCurrentTZDate(checkedAt));
