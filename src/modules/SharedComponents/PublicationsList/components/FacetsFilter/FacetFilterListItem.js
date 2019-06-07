import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {withStyles} from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    listItemGutters: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    },
    listText: {
        fontWeight: 400,
    }
});

export function FacetsFilterListItem({facetTitle, classes, open, key, children, disabled, onToggle}) {
    return (
        <Fragment key={`facet_fragment_${key}`}>
            <ListItem
                button
                disabled={disabled}
                key={`facet_filter_${key}`}
                classes={{
                    gutters: classes.listItemGutters
                }}
                onClick={onToggle}
            >
                <ListItemText disableTypography>
                    <Typography variant={'body2'} color={'textPrimary'} className={classes.listText}>
                        {facetTitle}
                    </Typography>
                </ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {
                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit
                >
                    {children}
                </Collapse>
            }
        </Fragment>
    );
}

FacetsFilterListItem.propTypes = {
    key: PropTypes.string,
    facetTitle: PropTypes.string,
    disabled: PropTypes.bool,
    open: PropTypes.bool,
    classes: PropTypes.object,
    children: PropTypes.any,
    onToggle: PropTypes.func
};

function isOpenOrDisabled(prevProps, nextProps) {
    return prevProps.open === nextProps.open && prevProps.disabled === nextProps.disabled && prevProps.children === nextProps.children;
}

export default React.memo(withStyles(styles)(FacetsFilterListItem), isOpenOrDisabled);
