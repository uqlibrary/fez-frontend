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

export const AdminRecordDrawerBlock = ({ block, index, copyToClipboard }) => {
    const classes = useStyles();

    if (block.type === 'header') {
        return (
            <Typography
                variant={'subtitle2'}
                className={classes.contentTitle}
                key={`header-${block.value?.replace(/ /g, '-').toLowerCase()}-${index}`}
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
                    key={`content-clipboard-${block.value?.replace(/ /g, '-').toLowerCase()}-${index}`}
                >
                    {block.value ?? '-'}
                    {block.value && (
                        <FileCopyOutlinedIcon
                            fontSize="inherit"
                            onClick={e => copyToClipboard(e, block.value)}
                            className={classes.cursor}
                            key={index}
                        />
                    )}
                </Typography>
            );
        } else if (!!block.scrollable === true) {
            return (
                <Typography variant={'body2'} component={'div'} className={classes.notesField} key={block.key}>
                    {block.value}
                </Typography>
            );
        } else {
            return (
                <Typography variant={'body2'} key={`content-${block.value?.replace(/ /g, '-').toLowerCase()}-${index}`}>
                    {block.value}
                </Typography>
            );
        }
    }
};

AdminRecordDrawerBlock.propTypes = {
    block: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    index: PropTypes.number.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
};

export default React.memo(AdminRecordDrawerBlock);
