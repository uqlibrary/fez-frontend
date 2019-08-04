import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FacetFilterListItem from './FacetFilterListItem';
import FacetFilterNestedListItem from './FacetFilterNestedListItem';

export default class OpenAccessFilter extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        isActive: PropTypes.bool,
        open: PropTypes.bool,
        onToggle: PropTypes.func.isRequired,
        locale: PropTypes.object,
    };

    updateFilter = () => {
        this.props.onChange(!this.props.isActive);
    }

    render() {
        const txt = this.props.locale;
        const isActive = this.props.isActive;

        return (
            <FacetFilterListItem
                key="date-range"
                facetTitle={txt.displayTitle}
                disabled={this.props.disabled}
                onToggle={this.props.onToggle}
                open={this.props.open}
            >
                <FacetFilterNestedListItem
                    onFacetClick={this.updateFilter}
                    isActive={isActive}
                    primaryText={txt.activeFilter}
                    disabled={this.props.disabled}
                />
            </FacetFilterListItem>
        );
    }
}
