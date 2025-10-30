import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import AdminRecordDrawerSection from './AdminViewRecordDrawerSection';

const StyledDrawerContent = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    justifyContent: 'flex-start',
}));

const AdminViewRecordDrawerContent = ({
    title,
    content,
    actions = {},
    themeDirection = 'ltr',
    variant = 'Desktop',
}) => {
    return (
        <div
            key="drawContainer1"
            id={`adminDrawerContentContainer${variant}`}
            data-testid={`adminDrawerContentContainer${variant}`}
        >
            <Toolbar sx={{ height: '74px', display: { xs: 'none', md: 'block' } }} key="toolbarMobile" />

            <StyledDrawerContent key="mainHeader">
                <Typography variant={'h6'} tabIndex="0">
                    <IconButton
                        onClick={actions?.handleDrawerToggle}
                        id={`adminRecordDrawerCloseBtn${variant}`}
                        data-analyticsid={`btnAdminRecordDrawerCloseBtn${variant}`}
                        data-testid={`btnAdminRecordDrawerCloseBtn${variant}`}
                        aria-label="Close admin record drawer"
                        size="large"
                    >
                        {
                            /* c8 ignore next */
                            themeDirection === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />
                        }
                    </IconButton>
                    {title}
                </Typography>
            </StyledDrawerContent>
            <Divider key="headerDivider" />
            {content?.sections?.map((section, sectionIndex) => (
                <AdminRecordDrawerSection
                    section={section}
                    index={sectionIndex}
                    copyToClipboard={actions?.writeText}
                    key={`Drawer-Section-${sectionIndex}`}
                    variant={variant}
                />
            ))}
        </div>
    );
};
AdminViewRecordDrawerContent.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.shape({
        sections: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.arrayOf(
                    PropTypes.shape({
                        type: PropTypes.string.isRequired,
                        value: PropTypes.any.isRequired,
                        scrollable: PropTypes.bool,
                        key: PropTypes.string,
                        clipboard: PropTypes.bool,
                    }),
                ),
                PropTypes.shape({
                    type: PropTypes.oneOf(['divider']).isRequired,
                }),
            ]).isRequired,
        ).isRequired,
    }).isRequired,
    actions: PropTypes.object,
    themeDirection: PropTypes.string,
    variant: PropTypes.oneOf(['Desktop', 'Mobile']),
};

export default React.memo(AdminViewRecordDrawerContent);
