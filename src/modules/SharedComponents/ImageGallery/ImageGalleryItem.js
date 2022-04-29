import React from 'react';

import PropTypes from 'prop-types';

import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';

import { default as config } from 'config/imageGalleryConfig';
import ImageGalleryItemImage from './ImageGalleryItemImage';

import { pathConfig } from 'config/pathConfig';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

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
        wordBreak: 'break-word',
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
    titleBar: {
        background: 'none',
        height: '30px',
    },
    icon: {
        color: 'white',
        filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.5))',
    },
}));

const ImageGalleryItem = ({ item, classes, lazyLoading, itemWidth, itemHeight, security, ...rest }) => {
    const internalClasses = useStyles();
    const [restricted, setRestricted] = React.useState(false);
    const [advisory, setAdvisory] = React.useState(false);

    return (
        <ImageListItem
            id={`image-gallery-item-${item.rek_pid}`}
            data-testid={`image-gallery-item-${item.rek_pid}`}
            classes={{
                root: `${internalClasses.imageListItemRoot} ${classes?.imageListItem?.root ?? ''}`,
                item: `${internalClasses.imageListItemItem} ${classes?.imageListItem?.item ?? ''}`,
            }}
            {...rest}
        >
            <ExternalLink
                title={item.rek_title}
                href={pathConfig.records.view(item.rek_pid)}
                id={`gallery-item-${item.rek_pid}`}
                data-testid={`gallery-item-${item.rek_pid}`}
                target="_self"
                openInNewIcon={false}
            >
                <ImageGalleryItemImage
                    item={item}
                    security={security}
                    alt={item.rek_title}
                    width={itemWidth}
                    height={itemHeight}
                    loading={lazyLoading ? 'lazy' : 'eager'}
                    className={internalClasses.imageGalleryItemImage}
                    setRestricted={setRestricted}
                    setAdvisory={setAdvisory}
                />
                <ImageListItemBar
                    title={item.rek_title}
                    classes={{
                        root: `${internalClasses.imageListItemBarRoot} ${classes?.imageListItemBar?.root ?? ''}`,
                        title: `${internalClasses.imageListItemBarTitle} ${classes?.imageListItemBar?.title ?? ''}`,
                        titleWrap: `${internalClasses.imageListItemBarTitleWrap} ${classes?.imageListItemBar
                            ?.titleWrap ?? ''}`,
                    }}
                />
                {restricted && (
                    <ImageListItemBar
                        title={item.title}
                        position="top"
                        actionIcon={<LockOutlinedIcon className={internalClasses.icon} size="small" />}
                        actionPosition="left"
                        className={internalClasses.titleBar}
                    />
                )}
                {advisory && (
                    <ImageListItemBar
                        title={item.title}
                        position="top"
                        actionIcon={
                            <IconButton className={internalClasses.icon} size="small">
                                <ErrorOutlineOutlinedIcon />
                            </IconButton>
                        }
                        actionPosition="right"
                        className={internalClasses.titleBar}
                    />
                )}
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
