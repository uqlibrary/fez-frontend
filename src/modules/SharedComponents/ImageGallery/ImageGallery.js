import React from 'react';

import PropTypes from 'prop-types';
import ImageList from '@mui/material/ImageList';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { pathConfig } from 'config/pathConfig';
import { default as config } from 'config/imageGalleryConfig';
import ImageGalleryItem from './ImageGalleryItem';

const internalClasses = {
    imageListRoot: {
        overflow: 'hidden',
    },
    imageListItemRoot: {
        height: '100% !important',
    },
};

export const getItemUrl = pid => {
    return pathConfig.records.view(pid);
};

export const getItemsPerRow = (itemsPerRow, sm, md) => {
    if (!!itemsPerRow) return itemsPerRow;
    if (!!md) return 4;
    if (!!sm) return 3;
    return 2;
};

const ImageGallery = ({
    publicationsList,
    classes = {},
    lazyLoading = config.thumbnailImage.defaultLazyLoading,
    itemWidth = config.thumbnailImage.defaultWidth,
    itemHeight = config.thumbnailImage.defaultHeight,
    itemsPerRow,
    security = { isAdmin: false, isAuthor: false, author: {} },
    ...rest
}) => {
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const cols = getItemsPerRow(itemsPerRow, sm, md);

    return (
        <ImageList
            rowHeight={itemHeight}
            cols={cols}
            sx={{ ...internalClasses.imageListRoot, ...(!!classes && classes?.imageList?.root) }}
            id={'image-gallery'}
            data-testid={'image-gallery'}
            {...rest}
        >
            {publicationsList.map(item => (
                <ImageGalleryItem
                    key={item.rek_pid}
                    item={item}
                    url={getItemUrl(item.rek_pid)}
                    lazyLoading={lazyLoading}
                    itemWidth={itemWidth}
                    itemHeight={itemHeight}
                    classes={{
                        imageListItem: { root: internalClasses.imageListItemRoot },
                        imageListItemBar: internalClasses.imageListItemBar,
                    }}
                    security={security}
                />
            ))}
        </ImageList>
    );
};

ImageGallery.propTypes = {
    publicationsList: PropTypes.array.isRequired,
    security: PropTypes.object,
    classes: PropTypes.shape({
        imageList: PropTypes.object,
        imageListItem: PropTypes.object,
        imageListItemBar: PropTypes.object,
    }),
    lazyLoading: PropTypes.bool,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
    itemsPerRow: PropTypes.number,
};

export default React.memo(ImageGallery);
