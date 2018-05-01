import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import RaisedButton from 'material-ui/RaisedButton';

export default class MenuDrawer extends Component {
    static propTypes = {
        menuItems: PropTypes.array.isRequired,
        logoImage: PropTypes.string,
        logoText: PropTypes.string,
        drawerOpen: PropTypes.bool,
        docked: PropTypes.bool,
        onToggleDrawer: PropTypes.func,
        history: PropTypes.object.isRequired,
        locale: PropTypes.shape({
            skipNavTitle: PropTypes.string,
            skipNavAriaLabel: PropTypes.string,
            closeMenuLabel: PropTypes.string
        })
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.logoImage !== this.props.logoImage
        || nextProps.logoText !== this.props.logoText
        || nextProps.drawerOpen !== this.props.drawerOpen
        || nextProps.docked !== this.props.docked
        || JSON.stringify(nextProps.locale) !== JSON.stringify(this.props.locale)
        || JSON.stringify(nextProps.menuItems) !== JSON.stringify(this.props.menuItems);
    }

    focusOnElementId = (elementId) => {
        if (document.getElementById(elementId)) {
            document.getElementById(elementId).focus();
        }
    }

    skipMenuItems = () => {
        this.focusOnElementId('afterMenuDrawer');
    }

    navigateToLink = (url, target = '_blank') => {
        if (!!url) {
            if (url.indexOf('http') === -1) {
                // internal link
                this.props.history.push(url);
            } else {
                // external link
                window.open(url, target);
            }
        }

        if (!this.props.docked) {
            this.props.onToggleDrawer();
        }
    }

    renderMenuItems = items => (
        items.map((menuItem, index) => (
            menuItem.divider
                ? <Divider key={`menu_item_${index}`}/>
                : <span className="menu-item-container" key={`menu_item_${index}`}>
                    <ListItem
                        primaryText={menuItem.primaryText}
                        secondaryText={menuItem.secondaryText}
                        onTouchTap={this.navigateToLink.bind(this, menuItem.linkTo, menuItem.target)}
                        leftIcon={menuItem.leftIcon ? menuItem.leftIcon : null}/>
                </span>
        )))

    render() {
        const {menuItems, onToggleDrawer, drawerOpen, docked, logoImage,
            logoText, locale } = this.props;

        if (drawerOpen && !docked) {
            // set focus on menu on mobile view if menu is opened
            setTimeout(this.focusOnElementId.bind(this, 'mainMenu'), 0);
        }
        return (
            <Drawer
                containerClassName="main-drawer"
                open={drawerOpen}
                width={320}
                onRequestChange={onToggleDrawer}
                docked={docked}>
                {
                    drawerOpen &&
                    <div className="layout-fill side-drawer">
                        <div className="logo-wrapper">
                            <div className="columns is-gapless is-mobile">
                                <div className="column is-centered">
                                    {logoImage && <img src={logoImage} alt={logoText}/>}
                                </div>
                                <div className="column is-narrow is-hidden-tablet menuCloseButton">
                                    <IconButton onTouchTap={onToggleDrawer} aria-label={locale.closeMenuLabel}>
                                        <HardwareKeyboardArrowLeft/>
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        <List className="main-menu" id="mainMenu" tabIndex={-1}>
                            {
                                docked &&
                                <div className="skipNav" type="button"
                                    id="skipNav"
                                    onClick={this.skipMenuItems}
                                    onKeyPress={this.skipMenuItems}
                                    tabIndex={1}
                                    aria-label={locale.skipNavAriaLabel}>
                                    <RaisedButton
                                        secondary
                                        onTouchTap={this.skipMenuItems}
                                        className="skipNavButton"
                                        label={locale.skipNavTitle}
                                        tabIndex={-1}/>
                                </div>
                            }
                            {
                                this.renderMenuItems(menuItems)
                            }
                        </List>
                        <div id="afterMenuDrawer" tabIndex={-1}/>
                    </div>
                }
            </Drawer>
        );
    }
}
