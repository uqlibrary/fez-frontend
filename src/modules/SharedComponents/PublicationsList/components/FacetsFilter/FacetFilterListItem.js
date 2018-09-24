import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';

import {ListItem, ListItemText, Collapse, withStyles} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';

const styles = (theme) => ({
    listItemGutters: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    }
});

export class FacetsFilterListItem extends PureComponent {
    static propTypes = {
        key: PropTypes.string,
        facetTitle: PropTypes.string,
        disabled: PropTypes.bool,
        open: PropTypes.bool,
        classes: PropTypes.object,
        nestedItems: PropTypes.any,
        onToggle: PropTypes.func
    };

    render() {
        const {facetTitle, classes, open, key, nestedItems} = this.props;
        return (
            <Fragment key={`facet_fragment_${key}`}>
                <ListItem
                    button
                    disabled={this.props.disabled}
                    key={`facet_filter_${key}`}
                    classes={{
                        gutters: classes.listItemGutters
                    }}
                    onClick={this.props.onToggle}
                >
                    <ListItemText
                        primary={facetTitle}
                        primaryTypographyProps={{variant: 'body2'}} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                {
                    <Collapse
                        in={open}
                        timeout="auto"
                        unmountOnExit
                    >
                        {nestedItems}
                    </Collapse>
                }
            </Fragment>
        );
    }
}

export default withStyles(styles)(FacetsFilterListItem);
