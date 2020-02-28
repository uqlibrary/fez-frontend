import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import locale from 'locale/pages';
// import {pathConfig} from 'config/routes';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    researcherIDlink: {
        '&:hover': {
            cursor: 'pointer',
        },
        '& .error': {
            '-webkit-filter': 'grayscale(1)',
            filter: 'grayscale(1)',
        },
    },
    orcidLink: {
        color: theme.palette.white.main,
    },
});

export class DashboardResearcherIdsClass extends React.Component {
    static propTypes = {
        values: PropTypes.shape({
            publons: PropTypes.string,
            researcher: PropTypes.string,
            scopus: PropTypes.string,
            google_scholar: PropTypes.string,
            orcid: PropTypes.string,
        }),
        authenticated: PropTypes.shape({
            publons: PropTypes.bool,
            researcher: PropTypes.bool,
            scopus: PropTypes.bool,
            google_scholar: PropTypes.bool,
            orcid: PropTypes.bool,
        }),
        history: PropTypes.object.isRequired,
        classes: PropTypes.object,
    };

    navigateToRoute = (event, item) => {
        const link = locale.pages.dashboard.header.dashboardResearcherIds.links;
        this.props.history.push(link.notLinkedUrl[item]);
    };

    render() {
        const { values, authenticated, classes } = this.props;
        const txt = locale.pages.dashboard.header.dashboardResearcherIds;
        const link = locale.pages.dashboard.header.dashboardResearcherIds.links;
        return (
            <Grid container spacing={1} alignItems={'center'} style={{ marginTop: 12 }}>
                {values &&
                    Object.keys(values).map((item, index) => (
                        <Grid item key={index}>
                            {/* external URL's */}
                            {((values[item] && link.linkedUrl[item].indexOf('http') !== -1) ||
                                (!values[item] && link.notLinkedUrl[item].indexOf('http') !== -1)) && (
                                <ExternalLink
                                    id={item}
                                    openInNewIcon={false}
                                    className={classes.researcherIDlink}
                                    href={values[item] ? link.linkedUrl[item] + values[item] : link.notLinkedUrl[item]}
                                    title={
                                        values[item]
                                            ? txt.researcherIsLinked
                                                .replace('[resource]', txt.titles[item])
                                                .replace('[id]', values[item])
                                            : txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])
                                    }
                                >
                                    <div
                                        title={
                                            !!values[item]
                                                ? txt.researcherIsLinked
                                                    .replace('[resource]', txt.titles[item])
                                                    .replace('[id]', values[item])
                                                : txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])
                                        }
                                        className={
                                            'fez-icon ' +
                                            item +
                                            (values[item] && authenticated[item] ? ' ok' : ' error')
                                        }
                                        style={{ width: 32, height: 32, borderRadius: 32 }}
                                    />
                                </ExternalLink>
                            )}

                            {/* Internal URL's - will be non-linked ID's only */}
                            {!values[item] && link.notLinkedUrl[item].indexOf('http') === -1 && (
                                <a
                                    id={item}
                                    tabIndex="0"
                                    onClick={event => this.navigateToRoute(event, item)}
                                    className={classes.researcherIDlink}
                                    onKeyPress={event => this.navigateToRoute(event, item)}
                                    title={txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])}
                                >
                                    <div
                                        title={txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])}
                                        className={`fez-icon ${item} dashboard ${
                                            authenticated[item] ? ' ok' : ' error'
                                        }`}
                                    />
                                </a>
                            )}
                        </Grid>
                    ))}

                {values.orcid && (
                    <Grid item>
                        <a
                            href={txt.orcidUrlPrefix + values.orcid}
                            id={'orcid'}
                            target="_blank"
                            aria-label={txt.orcidlinkLabel}
                            title={txt.orcidlinkLabel}
                            tabIndex="0"
                        >
                            <Typography variant={'caption'} className={classes.orcidLink}>
                                {txt.orcidLinkPrefix}
                                {values.orcid}
                            </Typography>
                        </a>
                    </Grid>
                )}
            </Grid>
        );
    }
}

const StyledDashboardResearcherIds = withStyles(styles, { withTheme: true })(DashboardResearcherIdsClass);
const DashboardResearcherIds = props => <StyledDashboardResearcherIds {...props} />;
export default DashboardResearcherIds;
