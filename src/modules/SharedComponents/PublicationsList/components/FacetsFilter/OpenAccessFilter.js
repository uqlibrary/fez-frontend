import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {locale} from 'locale';

export default class OpenAccessFilter extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        value: PropTypes.bool,
        open: PropTypes.bool,
        itemClassName: PropTypes.string,
        subitemClassName: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            isActive: this.props.value
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isActive: nextProps.value
        });
    }

    toggleFilter = () => {
        this.setState({
            isActive: !this.state.isActive
        }, () => {
            this.props.onChange(this.state.isActive);
        });
    }

    render() {
        const txt = locale.components.facetsFilter.openAccessFilter;
        const isActive = this.state.isActive;

        return (
            <ListItem
                open={this.props.open}
                primaryText={txt.displayTitle}
                disabled={this.props.disabled}
                className={`${this.props.itemClassName} ${this.state.isActive ? 'active ' : ''} ${this.props.disabled ? 'disabled' : ''}`}
                primaryTogglesNestedList
                nestedItems={[
                    (
                        <ListItem
                            key="openAccessStatusItem"
                            className={`${this.props.subitemClassName} ${isActive ? 'active ' : ''} ${this.props.disabled ? 'disabled' : ''}`}
                            primaryText={txt.activeFilter}
                            disabled={this.props.disabled}
                            onClick={this.toggleFilter}
                            leftIcon={isActive ? <NavigationClose disabled={this.props.disabled} /> : null} />
                    )
                ]} />
        );
    }
}
