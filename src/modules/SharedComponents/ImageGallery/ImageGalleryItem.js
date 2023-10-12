import React from 'react';
import PropTypes from 'prop-types';

import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import txt from 'locale/components';
import { useHistory } from 'react-router';

import { handleKeyboardPressActivate } from 'helpers/general';

import { default as config } from 'config/imageGalleryConfig';
import ImageGalleryItemImage from './ImageGalleryItemImage';

const internalClasses = {
    imageListItemRoot: {
        backgroundColor: '#fff',
        border: '1px solid #d7d1cc',
    },
    imageListItemWithLink: {
        cursor: 'pointer',
    },
    imageListItemBarRoot: {
        height: '67px',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        padding: '10px',
    },
    imageListItemBarTitle: {
        fontSize: '14px',
        fontWeight: '500',
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
        padding: 0,
    },
    imageGalleryItemImage: {
        aspectRatio: 1,
        minWidth: '100px',
        minHeight: '100px',
        width: '100%',
        height: '100%',
    },
    imageListAlertBarRoot: {
        background: 'none',
        backgroundColor: '#4085c6',
        height: 'auto',
    },
    imageListAlertBarWrap: {
        margin: '0px',
        padding: '10px',
    },
    imageListAlertBarTitle: {
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: 'normal',
        whiteSpace: 'normal',
    },
};

const viewRecord = (history, url) => {
    history.push(url);
};

export const getAlertMessageText = ({ unavailable, restricted, advisory }) => {
    if (advisory && unavailable) return txt.components.imageGallery.alert.advisory;
    if (restricted && advisory && !unavailable) return txt.components.imageGallery.alert.restrictedAdvisory;
    if (restricted && !unavailable) return txt.components.imageGallery.alert.restricted;
    if (advisory && !unavailable) return txt.components.imageGallery.alert.advisory;
    if (unavailable) return txt.components.imageGallery.alert.unavailable;
    return null;
};

const ImageGalleryItem = ({
    item,
    withTitle,
    withAlert,
    url,
    history,
    classes,
    lazyLoading,
    itemWidth,
    itemHeight,
    security,
    ...rest
}) => {
    const [restricted, setRestricted] = React.useState(false);
    const [advisory, setAdvisory] = React.useState(false);
    const [unavailable, setUnavailable] = React.useState(false);
    let historyObject = useHistory();
    if (!!history) {
        historyObject = history;
    }

    const alertMessage = React.useMemo(() => {
        return getAlertMessageText({ unavailable, restricted, advisory });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restricted, advisory, unavailable]);

    const clickLink =
        !!url && url.length > 0
            ? {
                  onClick: () => viewRecord(historyObject, url),
                  role: 'button',
              }
            : {};

    const listItemAriaLabel =
        !advisory && !restricted
            ? { 'aria-label': txt.components.imageGallery.thumbnail.ariaLabel.replace('[title]', item.rek_title) }
            : {};

    return (
        <ImageListItem
            id={`image-gallery-item-${item.rek_pid}`}
            data-testid={`image-gallery-item-${item.rek_pid}`}
            sx={{
                ...internalClasses.imageListItemRoot,
                ...(!!classes && classes?.imageListItem?.root),
                '& .MuiImageListItem-item': {
                    ...internalClasses.imageListItemItem,
                    ...(!!classes && classes?.imageListItem?.item),
                    ...(!!clickLink.onClick && internalClasses.imageListItemWithLink),
                },
            }}
            tabIndex={0}
            onKeyPress={key => handleKeyboardPressActivate(key, () => viewRecord(historyObject, url))}
            {...listItemAriaLabel}
            {...clickLink}
            {...rest}
        >
            <ImageGalleryItemImage
                item={item}
                security={security}
                alt={item.rek_title}
                width={itemWidth}
                height={itemHeight}
                loading={lazyLoading ? 'lazy' : 'eager'}
                classes={{
                    ...internalClasses.imageGalleryItemImage,
                    ...(!!classes && classes?.imageListItemImage),
                }}
                setRestricted={setRestricted}
                setAdvisory={setAdvisory}
                setUnavailable={setUnavailable}
            />
            {withTitle && (
                <ImageListItemBar
                    title={item.rek_title}
                    sx={{
                        ...internalClasses.imageListItemBarRoot,
                        ...(!!classes && classes?.imageListItemBar?.root),
                        '& .MuiImageListItemBar-title': {
                            ...internalClasses.imageListItemBarTitle,
                            ...(!!classes && classes?.imageListItemBar?.title),
                        },
                        '& .MuiImageListItemBar-titleWrap': {
                            ...internalClasses.imageListItemBarTitleWrap,
                            ...(!!classes && classes?.imageListItemBar?.titleWrap),
                        },
                    }}
                    id={`image-gallery-item-${item.rek_pid}-title`}
                    data-testid={`image-gallery-item-${item.rek_pid}-title`}
                />
            )}
            {!!alertMessage && withAlert && (
                <ImageListItemBar
                    title={alertMessage}
                    position="top"
                    sx={{
                        ...internalClasses.imageListAlertBarRoot,
                        ...(!!classes && classes?.imageListAlertBar?.root),
                        '& .MuiImageListItemBar-title': {
                            ...internalClasses.imageListAlertBarTitle,
                            ...(!!classes && classes?.imageListAlertBar?.title),
                        },
                        '& .MuiImageListItemBar-titleWrap': {
                            ...internalClasses.imageListAlertBarWrap,
                            ...(!!classes && classes?.imageListAlertBar?.titleWrap),
                        },
                    }}
                    id={`image-gallery-item-${item.rek_pid}-alert`}
                    data-testid={`image-gallery-item-${item.rek_pid}-alert`}
                />
            )}
        </ImageListItem>
    );
};

ImageGalleryItem.propTypes = {
    item: PropTypes.object.isRequired,
    withTitle: PropTypes.bool,
    withAlert: PropTypes.bool,
    url: PropTypes.string,
    history: PropTypes.object,
    security: PropTypes.object,
    classes: PropTypes.shape({
        imageListItem: PropTypes.shape({
            root: PropTypes.object,
            item: PropTypes.object,
        }),
        imageListItemImage: PropTypes.object,
        imageListItemBar: PropTypes.object,
        imageListAlertBar: PropTypes.object,
    }),
    lazyLoading: PropTypes.bool,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
};

ImageGalleryItem.defaultProps = {
    withTitle: true,
    withAlert: true,
    classes: {},
    security: { isAdmin: false, isAuthor: false, author: {} },
    lazyLoading: config.thumbnailImage.defaultLazyLoading,
    itemWidth: config.thumbnailImage.defaultWidth,
    itemHeight: config.thumbnailImage.defaultHeight,
};

export default React.memo(ImageGalleryItem);
