import { getFileData } from 'modules/SharedComponents/Toolbox/AttachedFilesField/AttachedFiles';
import { default as config } from 'config/imageGalleryConfig';

export const getThumbnail = (dataStream, openAccessStatusId, isAdmin, isAuthor) => {
    const fileData = getFileData(openAccessStatusId, dataStream, isAdmin, isAuthor);
    return fileData[0]?.thumbnailFileName ?? config.thumbnailImage.defaultImageName;
};
