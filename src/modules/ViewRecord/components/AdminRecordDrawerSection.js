/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React from 'react';
import Divider from '@material-ui/core/Divider';
import AdminRecordDrawerBlock from './AdminRecordDrawerBlock';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    drawerContent: {
        padding: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3),
        },
    },
}));

export const AdminRecordDrawerSection = ({ section, index, copyToClipboard }) => {
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
                    index={blockIndex}
                    copyToClipboard={copyToClipboard}
                    key={`Drawer-Block-${blockIndex}`}
                />
            ))}
        </div>
    );
};

AdminRecordDrawerSection.propTypes = {
    section: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    index: PropTypes.number.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
};

export default React.memo(AdminRecordDrawerSection);
