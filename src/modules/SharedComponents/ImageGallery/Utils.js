import { viewRecordsConfig } from 'config';
import { checkForThumbnail } from 'modules/ViewRecord/components/Files';
import { getFileOpenAccessStatus } from 'modules/SharedComponents/Toolbox/AttachedFilesField/AttachedFiles';
import { isAdded } from 'helpers/datastreams';

export const isFileValid = ({ files: { blacklist } } /* , isAdmin = false, isAuthor = false*/) => dataStream => {
    const prefixMatch = !!dataStream.dsi_dsid.match(blacklist.namePrefixRegex);
    const suffixMatch = !!dataStream.dsi_dsid.match(blacklist.nameSuffixRegex);

    return !prefixMatch && !suffixMatch && isAdded(dataStream);
};
export const getFileData = (openAccessStatusId, dataStreams /* , isAdmin, isAuthor*/) => {
    return !!dataStreams && dataStreams.length > 0
        ? dataStreams.filter(isFileValid(viewRecordsConfig /* , isAdmin, isAuthor*/)).map(dataStream => {
              const fileName = dataStream.dsi_dsid;
              const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
              const openAccessStatus = getFileOpenAccessStatus(openAccessStatusId, dataStream);

              return {
                  fileName,
                  thumbnailFileName,
                  openAccessStatus,
                  securityStatus: true,
              };
          })
        : [];
};

export const getThumbnail = (dataStream, openAccessStatusId, isAdmin, isAuthor) => {
    const fileData = getFileData(openAccessStatusId, dataStream, isAdmin, isAuthor);
    return {
        filename: fileData[0]?.thumbnailFileName,
    };
};
