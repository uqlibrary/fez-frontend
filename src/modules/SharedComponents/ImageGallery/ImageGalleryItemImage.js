import React from 'react';

import PropTypes from 'prop-types';

import { default as config } from 'config/imageGalleryConfig';
import { getThumbnail, getUrl } from './Utils';
import { makeStyles } from '@material-ui/core/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const useStyles = makeStyles(() => ({
    imageGalleryItemImage: {
        objectFit: 'cover',
    },
    lockIcon: {
        position: 'absolute',
        top: '5px',
        left: '5px',
        width: '25px',
        height: '25px',
        filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.5))',
    },
}));

const ImageGalleryItemImage = ({ item, security, className, optional, setRestricted, setAdvisory, ...rest }) => {
    const classes = useStyles();

    const fileData = getThumbnail(item, security.isAdmin, security.isAuthor);
    const thumbnailRestricted = !!fileData?.thumbnailFileName && (!fileData?.securityStatus || !fileData.isWhiteListed);
    const thumbnailAdvisory =
        (!security.isAdmin &&
            !!fileData?.thumbnailFileName &&
            // eslint-disable-next-line camelcase
            item.fez_record_search_key_advisory_statement?.rek_advisory_statement) ??
        false;

    React.useEffect(() => {
        if (thumbnailRestricted && !!setRestricted) setRestricted(true);
        if (thumbnailAdvisory && !!setAdvisory) setAdvisory(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!!!fileData?.thumbnailFileName && optional) return <></>; // no thumbnail available but optional is true

    // at this stage fileData could still be null, which is fine as below will fall back to default image

    return (
        <LazyLoadImage
            id={`imageGalleryItemImage-${item.rek_pid}`}
            data-testid={`imageGalleryItemImage-${item.rek_pid}`}
            src={
                !thumbnailRestricted && !thumbnailAdvisory
                    ? `${getUrl(item.rek_pid, fileData?.thumbnailFileName, fileData?.checksums?.thumbnail)}`
                    : config.thumbnailImage.defaultImageName
            }
            onError={
                /* istanbul ignore next */ e => {
                    /* istanbul ignore next */
                    e.target.onerror = null;
                    // env vars from root .env file e.g. GALLERY_IMAGE_PATH_PREPEND='/images/thumbs/'
                    // TODO - need a proper fallback image and guaranteed location on server
                    /* istanbul ignore next */
                    e.target.src = config.thumbnailImage.defaultImageName;
                }
            }
            className={`${classes.imageGalleryItemImage} ${className} image-gallery-item-image`}
            {...rest}
        />

        // <img
        //     id={`imageGalleryItemImage-${item.rek_pid}`}
        //     data-testid={`imageGalleryItemImage-${item.rek_pid}`}
        //     src={
        //         !thumbnailRestricted && !thumbnailAdvisory
        //             ? `${getUrl(item.rek_pid, fileData?.thumbnailFileName, fileData?.checksums?.thumbnail)}`
        //             : config.thumbnailImage.defaultImageName
        //     }
        //     onError={
        //         /* istanbul ignore next */ e => {
        //             /* istanbul ignore next */
        //             e.target.onerror = null;
        //             // env vars from root .env file e.g. GALLERY_IMAGE_PATH_PREPEND='/images/thumbs/'
        //             // TODO - need a proper fallback image and guaranteed location on server
        //             /* istanbul ignore next */
        //             e.target.src = config.thumbnailImage.defaultImageName;
        //         }
        //     }
        //     className={`${classes.imageGalleryItemImage} ${className} image-gallery-item-image`}
        //     {...rest}
        // />
    );
};

ImageGalleryItemImage.propTypes = {
    item: PropTypes.object.isRequired,
    security: PropTypes.object,
    className: PropTypes.string,
    optional: PropTypes.bool,
    setRestricted: PropTypes.func,
    setAdvisory: PropTypes.func,
};

ImageGalleryItemImage.defaultProps = {
    security: { isAdmin: false, isAuthor: false },
    className: '',
    optional: false,
};

export default ImageGalleryItemImage;
