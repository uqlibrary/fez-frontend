import React from 'react';

import PropTypes from 'prop-types';
import ImageList from '@material-ui/core/ImageList';
import { makeStyles } from '@material-ui/core/styles';

import { default as config } from 'config/imageGalleryConfig';
import ImageGalleryItem from './ImageGalleryItem';

const useStyles = makeStyles(
    theme => ({
        root: {
            [theme.breakpoints.down('xs')]: {},
        },
    }),
    { withTheme: true },
);

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
    const { imageGallery, ...otherClasses } = classes;

    return (
        <ImageList
            rowHeight={itemHeight}
            cols={itemsPerRow}
            classes={{ ...internalClasses, ...imageGallery }}
            {...rest}
        >
            {publicationsList.map(item => (
                <ImageGalleryItem
                    key={item.rek_pid}
                    item={item}
                    lazyLoading={lazyLoading}
                    itemWidth={itemWidth}
                    itemHeight={itemHeight}
                    classes={otherClasses}
                    security={security}
                />
            ))}
        </ImageList>
    );
};

ImageGallery.propTypes = {
    publicationsList: PropTypes.array.isRequired,
    security: PropTypes.object,
    classes: PropTypes.object,
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
    itemsPerRow: config.thumbnailImage.defaultItemsPerRow,
};

export default ImageGallery;
