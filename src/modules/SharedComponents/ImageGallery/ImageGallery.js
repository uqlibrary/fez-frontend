import React from 'react';

import PropTypes from 'prop-types';
import ImageList from '@material-ui/core/ImageList';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { pathConfig } from 'config/pathConfig';
import { default as config } from 'config/imageGalleryConfig';
import ImageGalleryItem from './ImageGalleryItem';

import { PATH_PREFIX } from 'config/general';

const useStyles = makeStyles(() => ({
    imageListItemRoot: {
        height: '100% !important',
    },
}));

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
    classes,
    lazyLoading,
    itemWidth,
    itemHeight,
    itemsPerRow,
    security,
    ...rest
}) => {
    const internalClasses = useStyles();

    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const cols = getItemsPerRow(itemsPerRow, sm, md);

    return (
        <>
            <ImageList
                rowHeight={itemHeight}
                cols={cols}
                classes={{ root: `${internalClasses.imageListRoot} ${classes?.imageList?.root ?? ''}` }}
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
            <div>
                {`process.env.BRANCH: ${process.env.BRANCH}`}
                <br />
                {`process.env.NODE_ENV: ${process.env.NODE_ENV}`}
                <br />
                {`process.env.USE_MOCK: ${process.env.USE_MOCK}`}
                <br />
                {`PATH_PREFIX: ${PATH_PREFIX}`}
            </div>
        </>
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

ImageGallery.defaultProps = {
    classes: {},
    security: { isAdmin: false, isAuthor: false },
    lazyLoading: config.thumbnailImage.defaultLazyLoading,
    itemWidth: config.thumbnailImage.defaultWidth,
    itemHeight: config.thumbnailImage.defaultHeight,
};

export default React.memo(ImageGallery);
