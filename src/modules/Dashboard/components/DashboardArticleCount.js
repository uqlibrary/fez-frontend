import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/pages';
import Grid from '@mui/material/Grid';
import withStyles from '@mui/styles/withStyles';

export const styles = theme => ({
    noOfArticles: {
        padding: '0 16px',
        color: theme.palette.white.main,
        fontSize: '4.75rem',
        lineHeight: '4.75rem',
        textAlign: 'center',
        fontWeight: theme.typography.fontWeightLight,
    },
    articlesFrom: {
        padding: '0 16px',
        color: theme.palette.white.main,
        fontSize: '0.9rem',
        lineHeight: '1rem',
        textAlign: 'center',
        fontWeight: theme.typography.fontWeightLight,
    },
    dateRange: {
        padding: '0 16px',
        color: theme.palette.white.main,
        fontSize: '1.25rem',
        lineHeight: '1.5rem',
        textAlign: 'center',
        fontWeight: theme.typography.fontWeightLight,
    },
});

export class DashboardArticleCount extends PureComponent {
    static propTypes = {
        articleCount: PropTypes.number,
        articleFirstYear: PropTypes.number,
        articleLastYear: PropTypes.number,
        classes: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const txt = locale.pages.dashboard.header.dashboardArticleCount;
        return (
            <Grid container direction={'column'}>
                {this.props.articleCount && this.props.articleFirstYear && this.props.articleLastYear && (
                    <React.Fragment>
                        <Grid item className={classes.noOfArticles}>
                            {this.props.articleCount}
                        </Grid>
                        <Grid item className={classes.articlesFrom}>
                            {txt.countTitle}
                        </Grid>
                        <Grid item className={classes.dateRange}>
                            {this.props.articleFirstYear}
                            <span>{txt.yearSeparator}</span>
                            {this.props.articleLastYear}
                        </Grid>
                    </React.Fragment>
                )}
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DashboardArticleCount);
