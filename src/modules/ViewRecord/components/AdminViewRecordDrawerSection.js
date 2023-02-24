/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React from 'react';
import Divider from '@mui/material/Divider';
import AdminRecordDrawerBlock from './AdminViewRecordDrawerBlock';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
    drawerContent: {
        padding: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3),
        },
    },
}));

export const AdminRecordDrawerSection = ({ section, index, copyToClipboard, variant }) => {
    const classes = useStyles();

    if (typeof section === 'object' && section.type === 'divider') {
        return <Divider key={`divider-${index}`} />;
    }
    if (!Array.isArray(section)) return <></>;

    return (
        <div className={classes.drawerContent} key={`section-${index}`}>
            {// eslint-disable-next-line react/prop-types
            section.map((block, blockIndex) => (
                <AdminRecordDrawerBlock
                    block={block}
                    parentIndex={index}
                    index={blockIndex}
                    copyToClipboard={copyToClipboard}
                    key={`drawer-block-${blockIndex}`}
                    variant={variant}
                />
            ))}
        </div>
    );
};

AdminRecordDrawerSection.propTypes = {
    section: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    index: PropTypes.number.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['Desktop', 'Mobile']),
};

export default React.memo(AdminRecordDrawerSection);
