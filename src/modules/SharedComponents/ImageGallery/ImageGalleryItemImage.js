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
    if (!!!fileData?.thumbnailFileName && optional) return <></>;
    if (!fileData?.securityStatus) return <Lock color={'secondary'} className={classes.lockIcon} />;
    return (
        <img
            id={`imageGalleryItemImage-${item.rek_pid}`}
            data-testid={`imageGalleryItemImage-${item.rek_pid}`}
            src={`${getUrl(item.rek_pid, fileData?.thumbnailFileName, fileData?.checksums?.thumbnail)}`}
            onError={e => {
                e.target.onerror = null;
                // env vars from root .env file e.g. GALLERY_IMAGE_PATH_PREPEND='/images/thumbs/'
                e.target.src = `${process.env.GALLERY_IMAGE_PATH_PREPEND ?? ''}${
                    config.thumbnailImage.defaultImageName
                }`; // TODO - need a proper fallback image and guaranteed location on server
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
