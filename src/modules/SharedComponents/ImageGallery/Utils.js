import { viewRecordsConfig, pathConfig } from 'config';
import { checkForThumbnail, getFileOpenAccessStatus, getSecurityAccess } from 'modules/ViewRecord/components/Files';
import { isAdded } from 'helpers/datastreams';
import { default as config } from 'config/imageGalleryConfig';

export const isFileValid = ({ files: { blacklist } }, isAdmin = false) => dataStream => {
    const prefixMatch = !!dataStream.dsi_dsid.match(blacklist.namePrefixRegex);
    const suffixMatch = !!dataStream.dsi_dsid.match(blacklist.nameSuffixRegex);

    return (!prefixMatch && !suffixMatch && isAdded(dataStream)) || isAdmin;
};

export const getThumbnailChecksums = (dataStreams, thumbnailFileName) => {
    const checksums = {
        thumbnail: undefined,
    };

    dataStreams.forEach(dataStream => {
        switch (dataStream.dsi_dsid) {
            case thumbnailFileName:
                checksums.thumbnail = dataStream.dsi_checksum;
                break;
            default:
        }
    });

    return checksums;
};

export const getWhiteListed = (publication, config) => {
    const isAllowed =
        config?.allowedTypes?.some(type => {
            return (
                type.viewType === publication.rek_display_type_lookup &&
                (!!!type.subType || type.subType === publication.rek_subtype)
            );
        }) ?? false;
    return isAllowed;
};

export const getFileData = (publication, isAdmin, isAuthor) => {
    const dataStreams = publication.fez_datastream_info;
    return !!dataStreams && dataStreams.length > 0
        ? dataStreams.filter(isFileValid(viewRecordsConfig, isAdmin)).map(dataStream => {
              const fileName = dataStream.dsi_dsid;
              const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
              const openAccessStatus = getFileOpenAccessStatus(publication, dataStream, { isAdmin, isAuthor });
              const securityStatus = getSecurityAccess(dataStream, { isAdmin, isAuthor });
              const checksums = getThumbnailChecksums(dataStreams, thumbnailFileName);
              const isWhiteListed = getWhiteListed(publication, config);

              return {
                  fileName,
                  thumbnailFileName,
                  checksums,
                  openAccessStatus,
                  securityStatus,
                  isWhiteListed,
              };
          })
        : [];
};

export const getThumbnail = (item, isAdmin, isAuthor) => {
    const fileData = getFileData(item, isAdmin, isAuthor);
    return fileData[0];
};

export const getUrl = (pid, fileName, checksum = '') => {
    const fullUrl = pid && fileName && pathConfig.file.url(pid, fileName, checksum);
    const url =
        fullUrl && process.env.GALLERY_IMAGE_PATH_PREPEND
            ? /* istanbul ignore next*/ `${process.env.GALLERY_IMAGE_PATH_PREPEND}${fullUrl.substr(
                  fullUrl.indexOf(fileName),
              )}`
            : (fullUrl && `https://espace.library.uq.edu.au/${fullUrl.substr(fullUrl.indexOf('view/'))}`) ?? fullUrl;
    // TODO: remove bodge for dev server testing
    return url;
};
