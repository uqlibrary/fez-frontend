import { viewRecordsConfig } from '../config';

export const isAudioXT = dataStream => {
    return !!(dataStream.dsi_dsid.indexOf('_xt.') >= 0 && dataStream.dsi_mimetype.indexOf('audio') >= 0);
};

export const isDerivative = dataStream => {
    const {
        files: { blacklist },
    } = viewRecordsConfig;

    const fileName = dataStream.dsi_dsid;

    return !!(fileName.match(blacklist.namePrefixRegex) || fileName.match(blacklist.nameSuffixRegex));
};

export const isAdded = datastream => {
    const STATE_ADDED = 'A';
    return datastream.dsi_state === STATE_ADDED;
};

// unused; kept for definition
// export const isDeleted = (datastream) => {
//     const STATE_DELETED = 'D';
//     return datastream.dsi_state === STATE_DELETED;
// };
