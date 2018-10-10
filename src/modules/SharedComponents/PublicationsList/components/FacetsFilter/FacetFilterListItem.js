import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {withStyles} from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
    listItemGutters: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    },
    listText: {
        ...theme.typography.body1
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
                        className={classes.listText}
                    />
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
