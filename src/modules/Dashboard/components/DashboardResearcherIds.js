import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';

import { OrcidSyncContext } from 'context';
import DashboardOrcidSync from '../containers/DashboardOrcidSync';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import locale from 'locale/pages';

import Grid from '@mui/material/GridLegacy';
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

const getUrl = (item, values, link) => (values[item] ? link.linkedUrl[item] + values[item] : link.notLinkedUrl[item]);

export const renderButton = args => {
    const { item, index, navHandler, values, authenticated, txt, link } = args;
    let isLinkedExternal = values[item] && link.linkedUrl[item].indexOf('http') !== -1;
    const isUnlinkedExternal = !values[item] && link.notLinkedUrl[item].indexOf('http') !== -1;
    let isInternal = !values[item] && link.notLinkedUrl[item].indexOf('http') === -1;

    let url = getUrl(item, values, link);
    let title = values[item]
        ? txt.researcherIsLinked.replace('[resource]', txt.titles[item]).replace('[id]', values[item])
        : txt.researcherIsNotLinked.replace('[resource]', txt.titles[item]);

    // google scholar id is linked via ORCID
    if (item === 'google_scholar' && !values[item]) {
        url = getUrl('orcid', values, link);
        if (values.orcid) {
            isInternal = false;
            isLinkedExternal = true;
            title = title.replace('Click for more information', 'Click to review via ORCID');
        } else {
            isInternal = true;
            isLinkedExternal = false;
            title = title.replace('Click for more information', 'Click to link via ORCID');
        }
    }

    const externalIconClassName = `fez-icon ${item} ${values[item] && authenticated[item] ? 'ok' : 'error'}`;
    const internalIconClassName = `fez-icon ${item} dashboard ${authenticated[item] ? 'ok' : 'error'}`;

    return (
        <Grid item key={index}>
            {/* external URLs */}
            <OrcidSyncContext.Consumer>
                {({ orcidSyncProps }) =>
                    (isLinkedExternal || isUnlinkedExternal) && (
                        <React.Fragment>
                            <StyledResearchedLink as={ExternalLink} id={item} openInNewIcon={false} href={url}>
                                {renderIcon(title, externalIconClassName)}
                            </StyledResearchedLink>
                            {item === 'orcid' && orcidSyncProps?.author && (
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
