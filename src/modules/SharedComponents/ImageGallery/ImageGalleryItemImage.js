import React from 'react';

import PropTypes from 'prop-types';

import { default as config } from 'config/imageGalleryConfig';
import { getThumbnail } from './Utils';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    imageGalleryItemImage: {
        objectFit: 'cover',
    },
}));

const ImageGalleryItemImage = ({ item, security, className, optional, ...rest }) => {
    const classes = useStyles();

    const thumbnail = getThumbnail(item.fez_datastream_info, null, security.isAdmin, security.isAuthor);
    if (!!!thumbnail.filename && optional) return <></>;

    return (
        <img
            id={`imageGalleryItemImage-${item.rek_pid}`}
            data-testid={`imageGalleryItemImage-${item.rek_pid}`}
            src={`${process.env.GALLERY_IMAGE_PATH_PREPEND ?? ''}${thumbnail.filename}`}
            onError={e => {
                e.target.onerror = null;
                e.target.src = `${process.env.GALLERY_IMAGE_PATH_PREPEND ?? ''}${
                    config.thumbnailImage.defaultImageName
                }`;
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
