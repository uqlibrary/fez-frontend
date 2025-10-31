import { pathConfig } from 'config';
import { checkForThumbnail, getFileOpenAccessStatus, getSecurityAccess } from 'modules/ViewRecord/components/Files';
import { getDownloadLicence } from 'helpers/licence';
import { isAdded, isDerivative } from 'helpers/datastreams';
import { default as config } from 'config/imageGalleryConfig';

export const isFileValid = dataStream => {
    return !isDerivative(dataStream) && isAdded(dataStream);
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
        config?.allowedTypes?.some(
            type =>
                type.viewType === publication.rek_display_type_lookup &&
                (!!!type.subTypes || type.subTypes.some(subType => subType === publication.rek_subtype)),
        ) ?? /* istanbul ignore next */ false;

    return isAllowed;
};

export const getFileData = (publication, props) => {
    const dataStreams = publication.fez_datastream_info;

    return !!!dataStreams
        ? []
        : dataStreams.filter(isFileValid).map(dataStream => {
              // isAdmin not passed to isFileValid because in this case all we care about is the thumbnail record
              const fileName = dataStream.dsi_dsid;
              const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
              const openAccessStatus = getFileOpenAccessStatus(publication, dataStream, props);
              const securityStatus = getSecurityAccess(dataStream, props);
              const checksums = getThumbnailChecksums(dataStreams, thumbnailFileName);
              const isWhiteListed = getWhiteListed(publication, config);

              return {
                  fileName,
                  thumbnailFileName:
                      !getDownloadLicence(publication) && !(!props.account && dataStream.dsi_security_policy === 4)
                          ? thumbnailFileName
                          : null,
                  checksums,
                  openAccessStatus,
                  securityStatus,
                  isWhiteListed,
              };
          });
};

export const sortThumbnailsBySecurityStatus = data => {
    const newData = [...data];
    return newData.sort((a, b) => {
        if (!!a.securityStatus && !!!b.securityStatus) return -1;
        if (!!b.securityStatus && !!!a.securityStatus) return 1;
        return 0;
    });
};
export const filterMissingThumbnails = data => {
    return data.filter(file => !!file.thumbnailFileName);
};

export const getThumbnail = (publication, props) => {
    const fileData = getFileData(publication, props);
    const sortedData = sortThumbnailsBySecurityStatus(fileData);
    const filteredFileData = filterMissingThumbnails(sortedData);
    return filteredFileData?.[0] ?? {};
};

export const getUrl = (pid, fileName, checksum = '') => {
    const fullUrl = pid && fileName && pathConfig.file.url(pid, fileName, checksum);
    const url =
        fullUrl && process.env.USE_MOCK
            ? /* istanbul ignore next*/ `${process.env.GALLERY_IMAGE_PATH_PREPEND}${fullUrl.substr(
                  fullUrl.indexOf(fileName),
              )}`
            : (fullUrl ?? '');
    return url;
};
