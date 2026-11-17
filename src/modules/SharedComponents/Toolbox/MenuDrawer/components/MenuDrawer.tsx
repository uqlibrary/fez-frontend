import React, { Fragment } from 'react';
import { visuallyHidden } from '@mui/utils';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import menuLocale from 'locale/menu';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import IconButton from '@mui/material/IconButton';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router';
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
    closeMenuLabel: string;
    navAriaLabel?: string;
    opensInNewWindow?: string;
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

const renderMenuItem = (
    navigateToLink: (url: string, target?: string) => void,
    menuItem: MenuItem,
    index: number,
    opensInNewWindow?: string,
): React.JSX.Element => {
    let primaryText: React.ReactNode = menuItem.primaryText;
    if (menuItem.isExternal) {
        // The menu button already opens the link, so this is plain text with the new window icon rather
        // than a nested link: a second focusable element gave keyboard users two stops for one item.
        primaryText = (
            <Box
                component="span"
                id={`${index}-${kebabCase(String(menuItem.primaryText))}-link`}
                sx={{
                    color: 'text.primary',
                    display: 'inline-block',
                    maxWidth: '100%',
                    verticalAlign: 'bottom',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }}
            >
                <OpenInNew
                    aria-hidden="true"
                    sx={{ color: 'inherit', fontSize: '0.66rem', float: 'right', marginLeft: '0.25rem' }}
                />
                {menuItem.primaryText}
                {!!opensInNewWindow && <Box component="span" sx={visuallyHidden}>{` ${opensInNewWindow}`}</Box>}
            </Box>
        );
    }
    return (
        <ListItem key={`menu-item-${index}`} sx={{ p: 0 }}>
            <ListItemButton
                onClick={() => navigateToLink(menuItem.linkTo, menuItem.target)}
                id={`menu-item-${index}`}
                className="menu-item-container"
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
            </ListItemButton>
        </ListItem>
    );
};

// Each run of items between dividers is its own list, so screen readers announce real lists with the
// divider as a separator between them (WCAG 1.3.1). Item indexes stay global so element ids are unchanged.
const renderMenuItems = (
    navigateToLink: (url: string, target?: string) => void,
    items: MenuItem[],
    opensInNewWindow?: string,
): React.JSX.Element[] => {
    const elements: React.JSX.Element[] = [];
    let listKey = 0;
    let listItems: React.JSX.Element[] = [];
    const closeList = (): void => {
        elements.push(
            <List key={`menu_list_${listKey}`} sx={{ paddingTop: 0, paddingBottom: 0 }}>
                {listItems}
            </List>,
        );
    };
    items.forEach((menuItem: MenuItem, index: number) => {
        if (menuItem.divider) {
            closeList();
            elements.push(<Divider key={`menu_item_${index}`} />);
            listKey = index;
            listItems = [];
        } else {
            listItems.push(renderMenuItem(navigateToLink, menuItem, index, opensInNewWindow));
        }
    });
    closeList();
    return elements;
};

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
                '&.MuiDrawer-docked.MuiDrawer-anchorLeft > .MuiDrawer-paper': {
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
                    {/* The nav holds the menu header and the lists of menu items. */}
                    <Box
                        component="nav"
                        id="mainMenu"
                        aria-label={locale.navAriaLabel}
                        sx={{ outline: 'none', flexGrow: 1, paddingBottom: '8px' }}
                        tabIndex={-1}
                    >
                        <Grid
                            container
                            spacing={0}
                            wrap="nowrap"
                            alignContent="center"
                            alignItems="center"
                            sx={{
                                backgroundColor: 'primary.main',
                                height: '70px',
                                boxShadow:
                                    '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), ' +
                                    '0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
                            }}
                        >
                            <Grid
                                size={{ xs: 10, sm: 12 }}
                                sx={{
                                    minWidth: 0,
                                    textAlign: 'center',
                                    '& img': {
                                        maxHeight: '45px',
                                    },
                                }}
                            >
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
                            <Grid size={2} sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center' }}>
                                <IconButton onClick={onToggleDrawer} aria-label={locale.closeMenuLabel} size="medium">
                                    <KeyboardArrowLeft sx={{ color: 'white.main' }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                        {renderMenuItems(navigateToLink, menuItems, locale.opensInNewWindow)}
                    </Box>
                    <Box
                        component="footer"
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
