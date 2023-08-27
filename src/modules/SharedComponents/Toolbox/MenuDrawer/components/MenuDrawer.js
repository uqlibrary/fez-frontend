import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as menuLocale } from 'locale/menu';

// MUI 1
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import withStyles from '@mui/styles/withStyles';

const styles = theme => {
    return {
        paper: {
            width: 260,
        },
        docked: {
            '& $paper': {
                '-webkit-box-shadow': '5px 0 5px -2px rgba(0,0,0,0.15)',
                'box-shadow': '5px 0 5px -2px rgba(0,0,0,0.15)',
            },
        },
        paperAnchorDockedLeft: {
            border: 'none',
        },
        header: {
            backgroundColor: theme.palette.primary.main,
            height: '70px',
            boxShadow:
                '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), ' +
                '0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
            textAlign: 'center',
            '& img': {
                maxHeight: '45px',
            },
        },
        skipNav: {
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
        },
        mainMenu: {
            outline: 'none',
            flexGrow: 1,
            paddingTop: 0,
        },
        ListItemTextPrimary: {
            ...theme.typography.body2,
            whiteSpace: 'nowrap',
            fontWeight: theme.typography.fontWeightMedium,
        },
        ListItemTextSecondary: {
            ...theme.typography.caption,
            textOverflow: 'ellipsis',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
        },
        mainMenuFooter: {
            textAlign: 'center',
            paddingBottom: '12px',
            fontSize: theme.typography.caption.fontSize,
            color: theme.palette.secondary.main,
        },
        iconButton: {
            color: theme.palette.white.main,
        },
    };
};

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
        classes: PropTypes.object,
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
                        className={this.props.classes.ListItem}
                    >
                        <ListItemText
                            classes={{
                                primary: this.props.classes.ListItemTextPrimary,
                                secondary: this.props.classes.ListItemTextSecondary,
                            }}
                            primary={menuItem.primaryText}
                            secondary={menuItem.secondaryText}
                            id={`menu-itemText-${menuItem.elementId ?? index}`}
                        />
                    </ListItem>
                </span>
            ),
        );

    render() {
        const { classes } = this.props;
        const txt = menuLocale.footer;
        const { menuItems, onToggleDrawer, drawerOpen, docked, logoImage, logoText, logoLink, locale } = this.props;
        if (drawerOpen && !docked) {
            // set focus on menu on mobile view if menu is opened
            setTimeout(this.focusOnElementId.bind(this, 'mainMenu'), 0);
        }
        return (
            <Drawer
                classes={{
                    docked: classes.docked,
                    paper: classes.paper,
                    paperAnchorDockedLeft: classes.paperAnchorDockedLeft,
                }}
                id="menudrawer"
                variant={docked ? 'permanent' : 'temporary'}
                open={drawerOpen}
                anchor="left"
                onClose={onToggleDrawer}
            >
                {drawerOpen && (
                    <Fragment>
                        <List component="nav" id="mainMenu" className={classes.mainMenu} tabIndex={-1}>
                            <Grid
                                container
                                spacing={0}
                                wrap={'nowrap'}
                                alignContent={'center'}
                                alignItems={'center'}
                                classes={{ container: classes.header }}
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
                                        <KeyboardArrowLeft className={classes.iconButton} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            {// Skip nav section
                            docked && (
                                <div
                                    type="button"
                                    className={classes.skipNav}
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
                                </div>
                            )}
                            {this.renderMenuItems(menuItems)}
                        </List>
                        <div id="afterMenuDrawer" data-testid="after-menu-drawer" tabIndex={-1} />
                        <div className={classes.mainMenuFooter}>
                            {txt.cricos.prefix}
                            <ExternalLink
                                href={txt.cricos.link}
                                title={txt.cricos.prefix}
                                openInNewIcon={false}
                                id="cricos"
                            >
                                {txt.cricos.number}
                            </ExternalLink>
                        </div>
                    </Fragment>
                )}
            </Drawer>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MenuDrawer);
