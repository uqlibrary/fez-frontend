import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    layoutCard: {
        maxWidth: '1200px',
        margin: '24px auto',
        width: '90%',
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 24px auto'
        },
    },
});

class Page extends Component {
    static propTypes = {
        title: PropTypes.any,
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

const StyledPage = withStyles(styles, {withTheme: true})(Page);
const StandardPage = (props) => <StyledPage {...props}/>;
export default StandardPage;
