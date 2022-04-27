import { viewRecordsConfig, pathConfig } from 'config';
import { checkForThumbnail, getFileOpenAccessStatus, getSecurityAccess } from 'modules/ViewRecord/components/Files';
import { isAdded } from 'helpers/datastreams';

export const isFileValid = ({ files: { blacklist } } /* , isAdmin = false, isAuthor = false*/) => dataStream => {
    const prefixMatch = !!dataStream.dsi_dsid.match(blacklist.namePrefixRegex);
    const suffixMatch = !!dataStream.dsi_dsid.match(blacklist.nameSuffixRegex);

    return !prefixMatch && !suffixMatch && isAdded(dataStream);
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

// TODO: logic of this function is key and needs revisiting once we
// have full clarity on who should see what and which record
// types to only show thumbs
export const getFileData = (publication, isAdmin, isAuthor) => {
    const dataStreams = publication.fez_datastream_info;

    return !!dataStreams && dataStreams.length > 0
        ? dataStreams.filter(isFileValid(viewRecordsConfig /* , isAdmin, isAuthor*/)).map(dataStream => {
              const fileName = dataStream.dsi_dsid;
              const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
              const openAccessStatus = getFileOpenAccessStatus(publication, dataStream);
              const securityStatus = getSecurityAccess(dataStream, { isAdmin, isAuthor });
              const checksums = getThumbnailChecksums(dataStreams, thumbnailFileName);

              return {
                  fileName,
                  thumbnailFileName,
                  checksums,
                  openAccessStatus,
                  securityStatus,
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
            ? `${process.env.GALLERY_IMAGE_PATH_PREPEND}${fullUrl.substr(fullUrl.indexOf(fileName))}`
            : (fullUrl && `https://espace.library.uq.edu.au/${fullUrl.substr(fullUrl.indexOf('view/'))}`) ?? fullUrl;
    // TODO: remove bodge for dev server testing
    return url;
};

export const isWhiteListed = (publication, config) => {
    let whitelistCheck = false;
    config.allowedTypes.map(type => {
        if (type.viewType === publication.rek_display_type_lookup && !!!whitelistCheck) {
            if (!!!type.subType) {
                whitelistCheck = true;
            } else {
                if (type.subType === publication.rek_subtype) {
                    whitelistCheck = true;
                }
            }
        }
    });

    return whitelistCheck;
};
