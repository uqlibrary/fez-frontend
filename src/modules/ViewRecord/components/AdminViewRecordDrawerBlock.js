/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    contentTitle: {
        textTransform: 'uppercase',
        fontWeight: 500,
    },
    notesField: {
        maxHeight: '40vh',
        overflowY: 'auto',
    },
    cursor: {
        cursor: 'pointer',
    },
});

export const AdminRecordDrawerBlock = ({ block, parentIndex, index, copyToClipboard }) => {
    const classes = useStyles();

    if (block.type === 'header') {
        return (
            <Typography
                variant={'subtitle2'}
                className={classes.contentTitle}
                key={`header-${parentIndex}-${index}`}
                id={`drawer-header-${parentIndex}-${index}`}
                tabIndex="0"
            >
                {block.value}
            </Typography>
        );
    } else {
        if (!!block.clipboard === true) {
            return (
                <Typography
                    variant={'body2'}
                    component="div"
                    gutterBottom
                    key={`content-clipboard-${parentIndex}-${index}`}
                    id={`drawer-content-clipboard-${parentIndex}-${index}`}
                    tabIndex="0"
                    aria-label={block.value !== '-' ? block.value : 'No content available'}
                >
                    {block.value}
                    {block.value && block.value !== '-' && (
                        <FileCopyOutlinedIcon
                            fontSize="inherit"
                            onClick={e => copyToClipboard(e, block.value)}
                            className={classes.cursor}
                            key={`clipboard-button-${parentIndex}-${index}`}
                            id={`drawer-clipboard-button-${parentIndex}-${index}`}
                            role="button"
                            tabIndex="0"
                            aria-label="Copy to clipboard button"
                        />
                    )}
                </Typography>
            );
        } else if (!!block.scrollable === true) {
            return (
                <Typography
                    variant={'body2'}
                    component={'div'}
                    className={classes.notesField}
                    key={`content-scrollable-${parentIndex}-${index}`}
                    id={`drawer-content-scrollable-${parentIndex}-${index}`}
                    tabIndex="0"
                    aria-label={block.value !== '-' ? block.value : 'No content available'}
                >
                    {block.value}
                </Typography>
            );
        } else {
            return (
                <Typography
                    variant={'body2'}
                    key={`content-value-${parentIndex}-${index}`}
                    id={`drawer-content-value-${parentIndex}-${index}`}
                    tabIndex="0"
                    aria-label={block.value !== '-' ? block.value : 'No content available'}
                >
                    {block.value}
                </Typography>
            );
        }
    }
};

AdminRecordDrawerBlock.propTypes = {
    block: PropTypes.object.isRequired,
    parentIndex: PropTypes.number,
    index: PropTypes.number.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
};

export default React.memo(AdminRecordDrawerBlock);
