import React from 'react';

import PropTypes from 'prop-types';

import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';

import { default as config } from 'config/imageGalleryConfig';
import ImageGalleryItemImage from './ImageGalleryItemImage';

import { pathConfig } from 'config/pathConfig';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    imageListItemRoot: {
        [theme.breakpoints.down('md')]: {
            width: '25% !important',
        },
        [theme.breakpoints.down('sm')]: {
            width: '33% !important',
        },
        [theme.breakpoints.down('xs')]: {
            width: '50% !important',
        },
    },
    imageListItemItem: {
        backgroundColor: '#51247a',
    },
    imageListItemBarRoot: {
        height: '67px',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        padding: '10px',
    },
    imageListItemBarTitle: {
        fontSize: '12px',
        lineHeight: '16px',
        display: '-webkit-box',
        lineClamp: 3,
        boxOrient: 'vertical',
        overflow: 'hidden',
        whiteSpace: 'normal',
    },
    imageListItemBarTitleWrap: {
        margin: 0,
    },
    imageGalleryItemImage: {
        minWidth: '100px',
        minHeight: '100px',
        width: '100%',
        height: '100%',
        [theme.breakpoints.up('md')]: {
            minWidth: '150px',
            minHeight: '150px',
        },
    },
}));

const ImageGalleryItem = ({ item, classes, lazyLoading, itemWidth, itemHeight, security, ...rest }) => {
    const internalClasses = useStyles();

    return (
        <ImageListItem
            classes={{
                root: `${internalClasses.imageListItemRoot} ${classes?.imageListItem?.root ?? ''}`,
                item: `${internalClasses.imageListItemItem} ${classes?.imageListItem?.item ?? ''}`,
            }}
            {...rest}
        >
            <ImageGalleryItemImage
                item={item}
                security={security}
                alt={item.rek_title}
                width={itemWidth}
                height={itemHeight}
                loading={lazyLoading ? 'lazy' : 'eager'}
                className={internalClasses.imageGalleryItemImage}
            />
            <ExternalLink
                title={item.rek_title}
                href={pathConfig.records.view(item.rek_pid)}
                id={`gallery-item-${item.rek_pid}`}
                data-testid={`gallery-item-${item.rek_pid}`}
                target="_self"
                openInNewIcon={false}
            >
                <ImageListItemBar
                    title={item.rek_title}
                    classes={{
                        root: `${internalClasses.imageListItemBarRoot} ${classes?.imageListItemBar?.root ?? ''}`,
                        title: `${internalClasses.imageListItemBarTitle} ${classes?.imageListItemBar?.title ?? ''}`,
                        titleWrap: `${internalClasses.imageListItemBarTitleWrap} ${classes?.imageListItemBar
                            ?.titleWrap ?? ''}`,
                    }}
                />
            </ExternalLink>
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
