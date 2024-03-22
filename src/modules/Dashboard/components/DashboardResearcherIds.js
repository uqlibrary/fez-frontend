import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { OrcidSyncContext } from 'context';
import DashboardOrcidSync from '../containers/DashboardOrcidSync';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import locale from 'locale/pages';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

const StyledResearchedLink = styled('div')({
    '&:hover': {
        cursor: 'pointer',
    },
    '& .error': {
        WebkitFilter: 'grayscale(1)',
        filter: 'grayscale(1)',
    },
});
const StyledOrcidBadge = styled('span')(({ theme }) => ({
    '& button': {
        padding: 0,
        position: 'relative',
        top: -15,
    },
    '& svg': {
        color: theme.palette.white.main,
    },
}));
const StyledOrcidLink = styled(Typography)(({ theme }) => ({
    color: theme.palette.white.main,
}));

export const renderIcon = (title, className) => {
    return (
        <Tooltip title={title}>
            <div className={className} style={{ width: 32, height: 32, borderRadius: 32 }} />
        </Tooltip>
    );
};

export const renderButton = args => {
    const { item, index, navHandler, values, authenticated, txt, link } = args;
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
                            <StyledResearchedLink as={ExternalLink} id={item} openInNewIcon={false} href={url}>
                                {renderIcon(title, externalIconClassName)}
                            </StyledResearchedLink>
                            {item === 'orcid' && showSyncUI && (
                                <StyledOrcidBadge>
                                    <DashboardOrcidSync {...orcidSyncProps} />
                                </StyledOrcidBadge>
                            )}
                        </React.Fragment>
                    )
                }
            </OrcidSyncContext.Consumer>

            {/* Internal URLs - will be non-linked IDs only */}
            {isInternal && (
                <StyledResearchedLink
                    as={'a'}
                    id={item}
                    data-testid={item}
                    tabIndex={0}
                    onClick={navHandler}
                    onKeyPress={navHandler}
                    title={title}
                >
                    <div title={title} className={internalIconClassName} />
                </StyledResearchedLink>
            )}
        </Grid>
    );
};

const DashboardResearcherIds = props => {
    const navigate = useNavigate();

    const navigateToRoute = (event, item) => {
        const link = locale.pages.dashboard.header.dashboardResearcherIds.links;
        navigate(link.notLinkedUrl[item]);
    };

    const txt = locale.pages.dashboard.header.dashboardResearcherIds;
    const link = locale.pages.dashboard.header.dashboardResearcherIds.links;

    return (
        <Grid container spacing={1} alignItems={'center'} style={{ marginTop: 12 }}>
            {props.values &&
                Object.keys(props.values).map((item, index) => {
                    const navHandler = event => navigateToRoute(event, item);
                    return renderButton({ item, index, navHandler, ...props, txt, link });
                })}

            {props.values.orcid && (
                <Grid item>
                    <a
                        href={`${txt.orcidUrlPrefix}${props.values.orcid}`}
                        id={'orcid'}
                        target="_blank"
                        aria-label={txt.orcidlinkLabel}
                        title={txt.orcidlinkLabel}
                        tabIndex={0}
                    >
                        <StyledOrcidLink
                            variant={'caption'}
                        >{`${txt.orcidLinkPrefix}${props.values.orcid}`}</StyledOrcidLink>
                    </a>
                </Grid>
            )}
        </Grid>
    );
};
DashboardResearcherIds.propTypes = {
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
};
export default DashboardResearcherIds;
