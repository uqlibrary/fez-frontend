import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { default as defaultConfig } from 'config/imageGalleryConfig';
import { getThumbnail, getUrl } from './Utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const StyledLazyLoadImage = styled(LazyLoadImage, {
    shouldForwardProp: prop => prop !== 'classes',
})(({ classes }) => ({
    objectFit: 'cover',
    boxSizing: 'border-box',
    display: 'block',
    ...classes,
}));

const ImageGalleryItemImage = ({
    item,
    security,
    customDefaultConfig = {},
    classes,
    setRestricted,
    setAdvisory,
    setUnavailable,
    ...rest
}) => {
    const [imgSrc, setImgSrc] = React.useState();

    const config = { ...defaultConfig, ...customDefaultConfig };

    const fileData = getThumbnail(item, security);

    const thumbnailBlacklisted = !fileData?.isWhiteListed ?? /* istanbul ignore next */ true;
    const thumbnailRestricted =
        (!!fileData?.thumbnailFileName && !fileData?.securityStatus) ?? /* istanbul ignore next */ false;
    // eslint-disable-next-line camelcase
    const thumbnailAdvisory = item.fez_record_search_key_advisory_statement?.rek_advisory_statement ?? false;

    // at this stage fileData could still be null, which is fine as below will fall back to default image
    const filenameSrc = getUrl(item.rek_pid, fileData?.thumbnailFileName, fileData?.checksums?.thumbnail);
    const filename =
        !thumbnailRestricted && !thumbnailAdvisory && !thumbnailBlacklisted && !!filenameSrc
            ? filenameSrc
            : config.thumbnailImage.defaultImageName;

    React.useEffect(() => {
        if (thumbnailAdvisory && !!setAdvisory) setAdvisory(true);
        if (
            !!setUnavailable &&
            (thumbnailBlacklisted || (filename === config.thumbnailImage.defaultImageName && !thumbnailRestricted))
        ) {
            setUnavailable(true);
        } else if (thumbnailRestricted && !!setRestricted) setRestricted(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onError = fallbackUrl => {
        setImgSrc(fallbackUrl);
        !!setUnavailable && setUnavailable(true);
    };
    const errorHandler =
        imgSrc !== config.thumbnailImage.defaultImageName
            ? {
                  onError: () => onError(config.thumbnailImage.defaultImageName),
              }
            : {};

    return (
        <StyledLazyLoadImage
            id={`imageGalleryItemImage-${item.rek_pid}`}
            data-testid={`imageGalleryItemImage-${item.rek_pid}`}
            src={imgSrc || filename}
            classes={classes}
            className={'image-gallery-item-image'}
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
    classes: PropTypes.object,
    setRestricted: PropTypes.func,
    setAdvisory: PropTypes.func,
    setUnavailable: PropTypes.func,
};

ImageGalleryItemImage.defaultProps = {
    security: { isAdmin: false, isAuthor: false, author: {} },
    classes: {},
};

export default React.memo(ImageGalleryItemImage);
