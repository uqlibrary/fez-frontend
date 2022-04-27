import React from 'react';

import PropTypes from 'prop-types';

import { default as config } from 'config/imageGalleryConfig';
import { getThumbnail, getUrl } from './Utils';
import { makeStyles } from '@material-ui/core/styles';
import Lock from '@material-ui/icons/Lock';

const useStyles = makeStyles(() => ({
    imageGalleryItemImage: {
        objectFit: 'cover',
    },
    lockIcon: {
        width: '100%',
        height: '100%',
    },
}));

const ImageGalleryItemImage = ({ item, security, className, optional, ...rest }) => {
    const classes = useStyles();

    const fileData = getThumbnail(item, security.isAdmin, security.isAuthor);
    // whitelist component

    const isWhiteListed = config.allowedTypes.indexOf(item.rek_display_type_lookup) >= 0;

    // console.log('IS THIS WHITELISTED', isWhiteListed);
    // no thumbnail available but optional is true
    if (!!!isWhiteListed || (!!!fileData?.thumbnailFileName && optional)) return <></>;
    if (!!fileData?.thumbnailFileName && !fileData?.securityStatus) {
        return <Lock color={'secondary'} className={classes.lockIcon} />; // thumbnail available but security denied
    }
    // at this stage fileData could still be null, which is fine as below will fall back to default image

    return (
        <img
            id={`imageGalleryItemImage-${item.rek_pid}`}
            data-testid={`imageGalleryItemImage-${item.rek_pid}`}
            src={`${getUrl(item.rek_pid, fileData?.thumbnailFileName, fileData?.checksums?.thumbnail)}`}
            onError={e => {
                e.target.onerror = null;
                // env vars from root .env file e.g. GALLERY_IMAGE_PATH_PREPEND='/images/thumbs/'
                // TODO - need a proper fallback image and guaranteed location on server
                e.target.src = config.thumbnailImage.defaultImageName;
            }}
            alt=""
            className={`${classes.imageGalleryItemImage} ${className} image-gallery-item-image`}
            {...rest}
        />
    );
};

ImageGalleryItemImage.propTypes = {
    item: PropTypes.object.isRequired,
    security: PropTypes.object,
    className: PropTypes.string,
    optional: PropTypes.bool,
};

ImageGalleryItemImage.defaultProps = {
    security: { isAdmin: false, isAuthor: false },
    className: '',
    optional: false,
};

export default ImageGalleryItemImage;
