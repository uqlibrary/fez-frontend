import React from 'react';
import PropTypes from 'prop-types';
import { OrcidSyncContext } from 'context';

import DashboardOrcidSync from '../containers/DashboardOrcidSync';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import locale from 'locale/pages';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import withStyles from '@mui/styles/withStyles';

export const styles = theme => ({
    researcherIDlink: {
        '&:hover': {
            cursor: 'pointer',
        },
        '& .error': {
            '-webkit-filter': 'grayscale(1)',
            filter: 'grayscale(1)',
        },
    },
    orcidSyncBadge: {
        '& button': {
            padding: 0,
            position: 'relative',
            top: -15,
        },
        '& svg': {
            color: theme.palette.white.main,
        },
    },
    orcidLink: {
        color: theme.palette.white.main,
    },
});

export const renderIcon = (title, className) => {
    return (
        <Tooltip title={title}>
            <div className={className} style={{ width: 32, height: 32, borderRadius: 32 }} />
        </Tooltip>
    );
};

export const renderButton = args => {
    const { item, index, navHandler, values, authenticated, classes, txt, link } = args;
    const isLinkedExternal = values[item] && link.linkedUrl[item].indexOf('http') !== -1;
    const isUnlinkedExternal = !values[item] && link.notLinkedUrl[item].indexOf('http') !== -1;
    const isInternal = !values[item] && link.notLinkedUrl[item].indexOf('http') === -1;

    const url = values[item] ? link.linkedUrl[item] + values[item] : link.notLinkedUrl[item];
    const title = values[item]
        ? txt.researcherIsLinked.replace('[resource]', txt.titles[item]).replace('[id]', values[item])
        : txt.researcherIsNotLinked.replace('[resource]', txt.titles[item]);
    const externalIconClassName = `fez-icon ${item} ${values[item] && authenticated[item] ? 'ok' : 'error'}`;
    const internalIconClassName = `fez-icon ${item} dashboard ${authenticated[item] ? 'ok' : 'error'}`;

    return (
        <Grid item key={index}>
            {/* external URLs */}
            <OrcidSyncContext.Consumer>
                {({ showSyncUI, orcidSyncProps }) =>
                    (isLinkedExternal || isUnlinkedExternal) && (
                        <React.Fragment>
                            <ExternalLink
                                id={item}
                                openInNewIcon={false}
                                className={classes.researcherIDlink}
                                href={url}
                            >
                                {renderIcon(title, externalIconClassName)}
                            </ExternalLink>
                            {item === 'orcid' && showSyncUI && (
                                <span className={classes.orcidSyncBadge}>
                                    <DashboardOrcidSync {...orcidSyncProps} />
                                </span>
                            )}
                        </React.Fragment>
                    )
                }
            </OrcidSyncContext.Consumer>

            {/* Internal URLs - will be non-linked IDs only */}
            {isInternal && (
                <a
                    id={item}
                    data-testid={item}
                    tabIndex={0}
                    onClick={navHandler}
                    className={classes.researcherIDlink}
                    onKeyPress={navHandler}
                    title={title}
                >
                    <div title={title} className={internalIconClassName} />
                </a>
            )}
        </Grid>
    );
};

export class DashboardResearcherIdsClass extends React.Component {
    static propTypes = {
        values: PropTypes.shape({
            researcher: PropTypes.string,
            scopus: PropTypes.string,
            google_scholar: PropTypes.string,
            orcid: PropTypes.string,
        }),
        authenticated: PropTypes.shape({
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
        const { values, classes } = this.props;
        const txt = locale.pages.dashboard.header.dashboardResearcherIds;
        const link = locale.pages.dashboard.header.dashboardResearcherIds.links;

        return (
            <Grid container spacing={1} alignItems={'center'} style={{ marginTop: 12 }}>
                {values &&
                    Object.keys(values).map((item, index) => {
                        const navHandler = event => this.navigateToRoute(event, item);
                        return renderButton({ item, index, navHandler, ...this.props, txt, link });
                    })}

                {values.orcid && (
                    <Grid item>
                        <a
                            href={`${txt.orcidUrlPrefix}${values.orcid}`}
                            id={'orcid'}
                            target="_blank"
                            aria-label={txt.orcidlinkLabel}
                            title={txt.orcidlinkLabel}
                            tabIndex={0}
                        >
                            <Typography variant={'caption'} className={classes.orcidLink}>
                                {`${txt.orcidLinkPrefix}${values.orcid}`}
                            </Typography>
                        </a>
                    </Grid>
                )}
            </Grid>
        );
    }
}

const DashboardResearcherIds = withStyles(styles, { withTheme: true })(DashboardResearcherIdsClass);
export default DashboardResearcherIds;
