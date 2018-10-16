import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {withStyles} from '@material-ui/core/styles';
import Clear from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';


const styles = (theme) => ({
    listItemGutters: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    },
    listText: {
        ...theme.typography.body2,
    },
    inset: {
        '&:first-child': {
            paddingLeft: theme.spacing.unit * 2
        }
    },
    selectedFacet: {
        color: theme.palette.primary.main
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
                    className={this.props.classes.listText}
                    disableTypography
                    classes={{inset: this.props.classes.inset}}
                >
                    <Typography variant={'body2'} color={isActive ? 'primary' : 'default'}>
                        {primaryText}
                    </Typography>
                </ListItemText>
            </ListItem>
        );
    }
}

export default withStyles(styles)(FacetsFilterNestedListItem);
