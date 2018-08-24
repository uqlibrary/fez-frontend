import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import jss from 'jss';
import nested from 'jss-nested';
jss.use(nested());

const styles = theme => ({
    layoutCard: {
        // border: '5px dashed red',
        maxWidth: '1200px',
        margin: '24px auto',
        width: '90%',
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 24px auto'
        },
    },
});

class StandardPage extends Component {
    static propTypes = {
        title: PropTypes.any,
        className: PropTypes.string,
        children: PropTypes.any,
        classes: PropTypes.object
    };

    render() {
        const {classes, title, children} = this.props;
        return (
            <Grid container>
                {title &&
                <h1 className="pageTitle">{title}</h1>
                }
                <Grid item className={classes.layoutCard}>
                    {children}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(StandardPage);
