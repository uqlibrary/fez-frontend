import React, { Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import menuLocale from 'locale/menu';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/GridLegacy';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import kebabCase from 'lodash/kebabCase';

// Define types for a menu item and locale properties
interface MenuItem {
    primaryText: string;
    secondaryText?: string;
    isExternal?: boolean;
    linkTo: string;
    target?: string;
    divider?: boolean;
    elementId?: string | number;
}

interface MenuDrawerLocale {
    skipNavTitle: string;
    skipNavAriaLabel: string;
    closeMenuLabel: string;
}

interface MenuDrawerProps {
    menuItems: MenuItem[];
    logoImage?: string;
    logoText?: string;
    logoLink?: string;
    drawerOpen: boolean;
    docked: boolean;
    onToggleDrawer: () => void;
    locale: MenuDrawerLocale;
}

const StyledSkipNav = styled('div')(() => ({
    width: '100%',
    height: '90%',
    position: 'absolute',
    zIndex: 998,
    left: '-2000px',
    outline: 'none',
    background:
        'linear-gradient(to bottom, rgba(255,255,255,0.75) 0%,rgba(255,255,255,0.75) 78%,rgba(255,255,255,0) 100%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr="#bfffffff", endColorstr="#00ffffff",GradientType=0 )',
    '&:focus': {
        left: 0,
    },
    '& .skipNavButton': {
        position: 'absolute',
        top: '25%',
        left: 'calc(50% - 90px)',
        textAlign: 'center',
        width: '160px',
        whiteSpace: 'normal',
        overflow: 'visible',
        zIndex: 999,
    },
}));

const renderMenuItem = (
    navigateToLink: (url: string, target?: string) => void,
    menuItem: MenuItem,
    index: number,
): React.JSX.Element => {
    let primaryText: React.ReactNode = menuItem.primaryText;
    if (menuItem.isExternal) {
        primaryText = (
            <ExternalLink
                sx={{ color: 'text.primary' }}
                className="noHover"
                openInNewIcon
                id={`${index}-${kebabCase(String(menuItem.primaryText))}`}
                title={menuItem.primaryText}
            >
                {menuItem.primaryText}
            </ExternalLink>
        );
    }

    return (
        <ListItem
            button
            onClick={() => navigateToLink(menuItem.linkTo, menuItem.target)}
            id={`menu-item-${index}`}
            className="menu-item-container"
            key={`menu-item-${index}`}
        >
            <ListItemText
                sx={theme => ({
                    '& .MuiListItemText-primary': {
                        ...theme.typography.body2,
                        whiteSpace: 'nowrap',
                        fontWeight: theme.typography.fontWeightMedium,
                    },
                    '& .MuiListItemText-secondary': {
                        ...theme.typography.caption,
                        textOverflow: 'ellipsis',
                        overflowX: 'hidden',
                        whiteSpace: 'nowrap',
                    },
                })}
                primary={primaryText}
                secondary={menuItem.secondaryText}
                id={`menu-itemText-${menuItem.elementId ?? index}`}
            />
        </ListItem>
    );
};

const renderMenuItems = (navigateToLink: (url: string, target?: string) => void, items: MenuItem[]): JSX.Element[] =>
    items.map((menuItem, index) => {
        if (menuItem.divider) {
            return <Divider key={`menu_item_${index}`} />;
        }
        return renderMenuItem(navigateToLink, menuItem, index);
    });

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
    menuItems,
    logoImage,
    logoText,
    logoLink,
    drawerOpen,
    docked,
    onToggleDrawer,
    locale,
}) => {
    const navigate = useNavigate();

    const focusOnElementId = (elementId: string): void => {
        document.getElementById(elementId)?.focus?.();
    };

    const skipMenuItems = (): void => {
        focusOnElementId('afterMenuDrawer');
    };

    const navigateToLink = (url: string, target: string = '_blank'): void => {
        /* istanbul ignore else */
        if (url) {
            if (url.indexOf('http') === -1) {
                // internal link
                navigate(url);
            } /* istanbul ignore else */ else {
                // external link
                window.open(url, target);
            }
        }
        /* istanbul ignore else */
        if (!docked) {
            onToggleDrawer();
        }
    };

    const txt = menuLocale.footer;
    if (drawerOpen && !docked) {
        // set focus on menu on mobile view if menu is opened
        setTimeout(() => focusOnElementId('mainMenu'), 0);
    }
    return (
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    width: '260px',
                    WebkitBoxShadow: '5px 0 5px -2px rgba(0,0,0,0.15)',
                    boxShadow: '5px 0 5px -2px rgba(0,0,0,0.15)',
                },
                '& .MuiDrawer-paperAnchorDockedLeft': {
                    border: 'none',
                },
            }}
            id="menudrawer"
            variant={docked ? 'permanent' : 'temporary'}
            open={drawerOpen}
            anchor="left"
            onClose={onToggleDrawer}
        >
            {drawerOpen && (
                <Fragment>
                    <List
                        component="nav"
                        id="mainMenu"
                        sx={{ outline: 'none', flexGrow: 1, paddingTop: 0 }}
                        tabIndex={-1}
                    >
                        <Grid
                            container
                            spacing={0}
                            wrap="nowrap"
                            alignContent="center"
                            alignItems="center"
                            sx={{
                                '&.MuiGrid-container': {
                                    backgroundColor: 'primary.main',
                                    height: '70px',
                                    boxShadow:
                                        '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), ' +
                                        '0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
                                    textAlign: 'center',
                                    '& img': {
                                        maxHeight: '45px',
                                    },
                                },
                            }}
                        >
                            <Grid item xs={10} sm={12} zeroMinWidth>
                                {logoImage && logoLink && logoText && (
                                    <ExternalLink
                                        id="main-menu-logo"
                                        href={logoLink}
                                        title={logoText}
                                        openInNewIcon={false}
                                        className="noHover"
                                    >
                                        <div
                                            className={logoImage}
                                            style={{ height: 50, width: 160, margin: '8px auto' }}
                                        >
                                            {logoText}
                                        </div>
                                    </ExternalLink>
                                )}
                            </Grid>
                            <Grid item xs={2} sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <IconButton onClick={onToggleDrawer} aria-label={locale.closeMenuLabel} size="small">
                                    <KeyboardArrowLeft sx={{ color: 'white.main' }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                        {
                            // Skip nav section
                            docked && (
                                <StyledSkipNav
                                    id="skipNav"
                                    onClick={skipMenuItems}
                                    onKeyPress={skipMenuItems}
                                    tabIndex={1}
                                    aria-label={locale.skipNavAriaLabel}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={skipMenuItems}
                                        className="skipNavButton"
                                        tabIndex={-1}
                                    >
                                        {locale.skipNavTitle}
                                    </Button>
                                </StyledSkipNav>
                            )
                        }
                        {renderMenuItems(navigateToLink, menuItems)}
                    </List>
                    <div id="afterMenuDrawer" data-testid="after-menu-drawer" tabIndex={-1} />
                    <Box
                        sx={theme => ({
                            textAlign: 'center',
                            paddingBottom: '12px',
                            fontSize: theme.typography.caption.fontSize,
                            color: 'secondary.main',
                        })}
                    >
                        {txt.cricos.prefix}
                        <ExternalLink
                            href={txt.cricos.link}
                            title={txt.cricos.prefix}
                            openInNewIcon={false}
                            id="cricos"
                        >
                            {txt.cricos.number}
                        </ExternalLink>
                    </Box>
                </Fragment>
            )}
        </Drawer>
    );
};

export default React.memo(MenuDrawer);
