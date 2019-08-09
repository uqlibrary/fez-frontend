import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles } from '@material-ui/core/styles';
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
            paddingLeft: theme.spacing.unit * 2,
        },
    },
    selectedFacet: {
        color: theme.palette.primary.main,
    },
});

export function FacetsFilterNestedListItem({ onFacetClick, index, disabled, primaryText, isActive, classes }) {
    return (
        <ListItem
            key={`facet-filter-nested-item-${index}`}
            button
            onClick={onFacetClick}
            disabled={disabled}
            classes={{
                gutters: classes.listItemGutters,
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
                className={classes.listText}
                disableTypography
                classes={{ inset: classes.inset }}
            >
                <Typography variant={'body2'} color={isActive ? 'primary' : 'default'}>
                    {primaryText}
                </Typography>
            </ListItemText>
        </ListItem>
    );
}

FacetsFilterNestedListItem.propTypes = {
    index: PropTypes.number,
    primaryText: PropTypes.string,
    disabled: PropTypes.bool,
    isActive: PropTypes.bool,
    classes: PropTypes.object,
    onFacetClick: PropTypes.func.isRequired,
};

function isActiveOrDisabled(prevProps, nextProps) {
    return prevProps.isActive === nextProps.isActive && prevProps.disabled === nextProps.disabled;
}

export default React.memo(withStyles(styles)(FacetsFilterNestedListItem), isActiveOrDisabled);
