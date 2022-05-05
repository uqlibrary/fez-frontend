import React from 'react';

import PropTypes from 'prop-types';

import { default as defaultConfig } from 'config/imageGalleryConfig';
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

const ImageGalleryItemImage = ({
    item,
    security,
    customDefaultConfig = {},
    className,
    setRestricted,
    setAdvisory,
    ...rest
}) => {
    const classes = useStyles();
    const [imgSrc, setImgSrc] = React.useState();

    const config = { ...defaultConfig, ...customDefaultConfig };

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

    // at this stage fileData could still be null, which is fine as below will fall back to default image
    const filenameSrc = getUrl(item.rek_pid, fileData?.thumbnailFileName, fileData?.checksums?.thumbnail);

    const filename =
        !thumbnailRestricted && !thumbnailAdvisory && !!filenameSrc
            ? filenameSrc
            : config.thumbnailImage.defaultImageName;

    const onError = fallbackUrl => {
        setImgSrc(fallbackUrl);
    };
    const errorHandler =
        imgSrc !== config.thumbnailImage.defaultImageName
            ? {
                  onError: () => onError(config.thumbnailImage.defaultImageName),
              }
            : {};

    return (
        <LazyLoadImage
            id={`imageGalleryItemImage-${item.rek_pid}`}
            data-testid={`imageGalleryItemImage-${item.rek_pid}`}
            src={imgSrc || filename}
            className={`${classes.imageGalleryItemImage} ${className} image-gallery-item-image`}
            {...errorHandler}
            {...rest}
        />
    );
};

ImageGalleryItemImage.propTypes = {
    item: PropTypes.object.isRequired,
    security: PropTypes.object,
    customDefaultConfig: PropTypes.shape({
        thumbnailImage: PropTypes.object,
        allowedTypes: PropTypes.array,
    }),
    className: PropTypes.string,
    setRestricted: PropTypes.func,
    setAdvisory: PropTypes.func,
};

ImageGalleryItemImage.defaultProps = {
    security: { isAdmin: false, isAuthor: false },
    className: '',
};

export default ImageGalleryItemImage;
