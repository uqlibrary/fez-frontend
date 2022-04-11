import React from 'react';

import PropTypes from 'prop-types';

import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';

import { default as config } from 'config/imageGalleryConfig';
import { getThumbnail } from './Utils';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme, props) => ({
    imageListItemRoot: {
        ...props?.imageListItem?.root,
    },
    imageListItemBarRoot: {
        height: '67px',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        padding: '10px',
        [theme.breakpoints.up('sm')]: {
            // padding: theme.spacing(2),
        },
        ...props?.imageListItemBar?.root,
    },
    imageListItemBarTitle: {
        /* these dont work in this version due to specificity but
                need them for multiline truncation of titles */
        fontSize: '12px',
        lineHeight: '16px',
        display: '-webkit-box',
        lineClamp: 3,
        boxOrient: 'vertical',
        overflow: 'hidden',
        whiteSpace: 'normal',
        ...props?.imageListItemBar?.title,
    },
    imageListItemBarTitleWrap: {
        margin: 0,
        ...props?.imageListItemBar.titleWrap,
    },
}));

const ImageGalleryItem = ({ item, classes, lazyLoading, itemWidth, itemHeight, security, ...rest }) => {
    const mergedClasses = useStyles(classes);

    return (
        <ImageListItem classes={{ root: mergedClasses.imageListItemRoot }} {...rest}>
            <img
                src={`${config.thumbnailImage.prependPath}${getThumbnail(
                    item.fez_datastream_info,
                    security.isAdmin,
                    security.isAuthor,
                )}`}
                alt={item.rek_title}
                width={itemWidth}
                height={itemHeight}
                loading={lazyLoading ? 'lazy' : 'eager'}
            />
            <ImageListItemBar
                title={item.rek_title}
                classes={{
                    root: mergedClasses.imageListItemBarRoot,
                    title: mergedClasses.imageListItemBarTitle,
                    titleWrap: mergedClasses.imageListItemBarTitleWrap,
                }}
            />
        </ImageListItem>
    );
};

ImageGalleryItem.propTypes = {
    item: PropTypes.object.isRequired,
    security: PropTypes.object,
    classes: PropTypes.shape({
        imageListItem: PropTypes.object,
        imageListItemBar: PropTypes.object,
    }),
    lazyLoading: PropTypes.bool,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
};

ImageGalleryItem.defaultProps = {
    classes: {},
    security: { isAdmin: false, isAuthor: false },
    lazyLoading: config.thumbnailImage.defaultLazyLoading,
    itemWidth: config.thumbnailImage.defaultWidth,
    itemHeight: config.thumbnailImage.defaultHeight,
};

export default ImageGalleryItem;
