import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {ListItem, ListItemText, ListItemIcon, withStyles} from '@material-ui/core';
import {Clear} from '@material-ui/icons';


const styles = (theme) => ({
    listItemGutters: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    },
    inset: {
        '&:first-child': {
            paddingLeft: theme.spacing.unit * 2
        }
    },
    selectedFacet: {
        color: theme.palette.accent.dark
    }
});

export class FacetsFilterNestedListItem extends PureComponent {
    static propTypes = {
        index: PropTypes.number,
        primaryText: PropTypes.string,
        disabled: PropTypes.bool,
        isActive: PropTypes.bool,
        classes: PropTypes.object,
        onFacetClick: PropTypes.func.isRequired,
    };

    render() {
        const {onFacetClick, index, disabled, primaryText, isActive} = this.props;
        return (
            <ListItem
                key={`facet-filter-nested-item-${index}`}
                button
                onClick={onFacetClick}
                disabled={disabled}
                classes={{
                    gutters: this.props.classes.listItemGutters
                }}
            >
                {
                    isActive &&
                    <ListItemIcon>
                        <Clear disabled={disabled}/>
                    </ListItemIcon>
                }
                <ListItemText
                    inset
                    primary={primaryText}
                    primaryTypographyProps={{
                        variant: 'body2',
                        color: isActive ? 'textPrimary' : 'textSecondary',
                        classes: {
                            colorTextPrimary: this.props.classes.selectedFacet
                        }
                    }}
                    classes={{inset: this.props.classes.inset}}
                />
            </ListItem>
        );
    }
}

export default withStyles(styles)(FacetsFilterNestedListItem);
