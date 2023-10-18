import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import locale from 'locale/pages';
import Grid from '@mui/material/Grid';

const StyledGridNumArticles = styled(Grid)(({ theme }) => ({
    padding: '0 16px',
    color: theme.palette.white.main,
    fontSize: '4.75rem',
    lineHeight: '4.75rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightLight,
}));

const StyledGridArticlesFrom = styled(Grid)(({ theme }) => ({
    padding: '0 16px',
    color: theme.palette.white.main,
    fontSize: '0.9rem',
    lineHeight: '1rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightLight,
}));

const StyledGridDateRange = styled(Grid)(({ theme }) => ({
    padding: '0 16px',
    color: theme.palette.white.main,
    fontSize: '1.25rem',
    lineHeight: '1.5rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightLight,
}));

export class DashboardArticleCount extends PureComponent {
    static propTypes = {
        articleCount: PropTypes.number,
        articleFirstYear: PropTypes.number,
        articleLastYear: PropTypes.number,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const txt = locale.pages.dashboard.header.dashboardArticleCount;
        return (
            <Grid container direction={'column'}>
                {this.props.articleCount && this.props.articleFirstYear && this.props.articleLastYear && (
                    <React.Fragment>
                        <StyledGridNumArticles item>{this.props.articleCount}</StyledGridNumArticles>
                        <StyledGridArticlesFrom item>{txt.countTitle}</StyledGridArticlesFrom>
                        <StyledGridDateRange item>
                            {this.props.articleFirstYear}
                            <span>{txt.yearSeparator}</span>
                            {this.props.articleLastYear}
                        </StyledGridDateRange>
                    </React.Fragment>
                )}
            </Grid>
        );
    }
}

export default DashboardArticleCount;
