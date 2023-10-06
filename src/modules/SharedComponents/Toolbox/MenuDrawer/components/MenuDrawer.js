import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as menuLocale } from 'locale/menu';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

const StyledSkipNav = styled('div')(() => ({
    width: '100%',
    height: '90%',
    position: 'absolute',
    zIndex: 998,
    left: '-2000px',
    outline: 'none',
    background:
        'linear-gradient(to bottom, rgba(255,255,255,0.75) 0%,rgba(255,255,255,0.75) 78%,' +
        'rgba(255,255,255,0) 100%)',
    filter:
        'progid:DXImageTransform.Microsoft.gradient( startColorstr="#bfffffff", ' +
        'endColorstr="#00ffffff",GradientType=0 )',
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

export class MenuDrawer extends Component {
    static propTypes = {
        menuItems: PropTypes.array.isRequired,
        logoImage: PropTypes.string,
        logoText: PropTypes.string,
        logoLink: PropTypes.string,
        drawerOpen: PropTypes.bool,
        docked: PropTypes.bool,
        onToggleDrawer: PropTypes.func,
        history: PropTypes.object.isRequired,
        locale: PropTypes.shape({
            skipNavTitle: PropTypes.string,
            skipNavAriaLabel: PropTypes.string,
            closeMenuLabel: PropTypes.string,
        }),
        hasIncompleteWorks: PropTypes.bool,
    };

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.logoImage !== this.props.logoImage ||
            nextProps.logoText !== this.props.logoText ||
            nextProps.drawerOpen !== this.props.drawerOpen ||
            JSON.stringify(nextProps.locale) !== JSON.stringify(this.props.locale) ||
            JSON.stringify(nextProps.menuItems) !== JSON.stringify(this.props.menuItems) ||
            nextProps.docked !== this.props.docked
        );
    }

    focusOnElementId = elementId => {
        /* istanbul ignore else */
        if (document.getElementById(elementId)) {
            document.getElementById(elementId).focus();
        }
    };

    skipMenuItems = () => {
        this.focusOnElementId('afterMenuDrawer');
    };

    navigateToLink = (url, target = '_blank') => {
        /* istanbul ignore else*/
        if (!!url) {
            if (url.indexOf('http') === -1) {
                // internal link
                this.props.history.push(url);
            } else {
                // external link
                window.open(url, target);
            }
        }

        /* istanbul ignore else*/
        if (!this.props.docked) {
            this.props.onToggleDrawer();
        }
    };

    renderMenuItems = items =>
        items.map((menuItem, index) =>
            menuItem.divider ? (
                <Divider key={`menu_item_${index}`} />
            ) : (
                <span className="menu-item-container" key={`menu-item-${index}`}>
                    <ListItem
                        button
                        onClick={this.navigateToLink.bind(this, menuItem.linkTo, menuItem.target)}
                        id={`menu-item-${index}`}
                    >
                        <ListItemText
                            sx={theme => ({
                                '& .MuiListItemText-primary': {
                                    ...theme.typography.body2,
                                    whiteSpace: 'nowrap',
                                    fontWeight: 'fontWeightMedium',
                                },
                                '& .MuiListItemText-secondary': {
                                    ...theme.typography.caption,
                                    textOverflow: 'ellipsis',
                                    overflowX: 'hidden',
                                    whiteSpace: 'nowrap',
                                },
                            })}
                            primary={menuItem.primaryText}
                            secondary={menuItem.secondaryText}
                            id={`menu-itemText-${menuItem.elementId ?? index}`}
                        />
                    </ListItem>
                </span>
            ),
        );

    render() {
        const txt = menuLocale.footer;
        const { menuItems, onToggleDrawer, drawerOpen, docked, logoImage, logoText, logoLink, locale } = this.props;
        if (drawerOpen && !docked) {
            // set focus on menu on mobile view if menu is opened
            setTimeout(this.focusOnElementId.bind(this, 'mainMenu'), 0);
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
                                wrap={'nowrap'}
                                alignContent={'center'}
                                alignItems={'center'}
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
                                    <IconButton
                                        onClick={onToggleDrawer}
                                        aria-label={locale.closeMenuLabel}
                                        size="small"
                                    >
                                        <KeyboardArrowLeft sx={{ color: 'white.main' }} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            {// Skip nav section
                            docked && (
                                <StyledSkipNav
                                    type="button"
                                    id="skipNav"
                                    onClick={this.skipMenuItems}
                                    onKeyPress={this.skipMenuItems}
                                    tabIndex={1}
                                    aria-label={locale.skipNavAriaLabel}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.skipMenuItems}
                                        className="skipNavButton"
                                        children={locale.skipNavTitle}
                                        tabIndex={-1}
                                    />
                                </StyledSkipNav>
                            )}
                            {this.renderMenuItems(menuItems)}
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
    }
}

export default MenuDrawer;
