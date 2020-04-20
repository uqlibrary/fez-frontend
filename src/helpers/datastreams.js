import { viewRecordsConfig } from '../config';
import { STATE_ADDED } from '../config/viewRecord';

export const isDerivative = dataStream => {
    const {
        files: { blacklist },
    } = viewRecordsConfig;

    const fileName = dataStream.dsi_dsid;

    return !!(fileName.match(blacklist.namePrefixRegex) || fileName.match(blacklist.nameSuffixRegex));
};

export const isAdded = datastream => {
    return datastream.dsi_state === STATE_ADDED;
};
