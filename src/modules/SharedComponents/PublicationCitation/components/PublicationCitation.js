import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { withTheme } from 'helpers/withTheme';

import { parseHtmlToJSX } from 'helpers/general';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { locale } from 'locale';
import { publicationTypes, pathConfig } from 'config';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

// citations for different publication types
import AdminActions from './citations/partials/AdminActions';
import AudioDocumentCitation from './citations/AudioDocumentCitation';
import BookChapterCitation from './citations/BookChapterCitation';
import BookCitation from './citations/BookCitation';
import CitationCounts from './citations/CitationCounts';
import ConferencePaperCitation from './citations/ConferencePaperCitation';
import ConferenceProceedingsCitation from './citations/ConferenceProceedingsCitation';
import CreativeWorkCitation from './citations/CreativeWorkCitation';
import DataCollectionCitation from './citations/DataCollectionCitation';
import DepartmentTechnicalReportCitation from './citations/DepartmentTechnicalReportCitation';
import DesignCitation from './citations/DesignCitation';
import DigilibImageCitation from './citations/DigilibImageCitation';
import GenericDocumentCitation from './citations/GenericDocumentCitation';
import ImageDocumentCitation from './citations/ImageDocumentCitation';
import JournalArticleCitation from './citations/JournalArticleCitation';
import JournalCitation from './citations/JournalCitation';
import ManuscriptCitation from './citations/ManuscriptCitation';
import NewspaperArticleCitation from './citations/NewspaperArticleCitation';
import PatentCitation from './citations/PatentCitation';
import PreprintCitation from './citations/PreprintCitation';
import ResearchReportCitation from './citations/ResearchReportCitation';
import SeminarPaperCitation from './citations/SeminarPaperCitation';
import ThesisCitation from './citations/ThesisCitation';
import VideoDocumentCitation from './citations/VideoDocumentCitation';
import WorkingPaperCitation from './citations/WorkingPaperCitation';
import { UnpublishedBufferCitationView } from './citations/partials/UnpublishedBufferCitationView';

import ImageGalleryItem from 'modules/SharedComponents/ImageGallery/ImageGalleryItem';

import { default as imageConfig } from 'config/imageGalleryConfig';

import { getWhiteListed } from 'modules/SharedComponents/ImageGallery/Utils';

const StyledGridActionButtons = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        marginTop: '12px',
    },
}));

const StyledPublicationImageWrapper = styled('div')(({ theme }) => ({
    display: 'inline-block',
    marginRight: '10px',
    marginBottom: '15px',
    aspectRatio: 1,
    minWidth: 0,
    minHeight: 0,

    [theme.breakpoints.down('md')]: {
        width: '50vw',
        height: '50vw',
        float: 'none',
        display: 'block',
        margin: 'auto auto 15px',
        minWidth: '50vw',
        minHeight: '50vw',
    },
    [theme.breakpoints.up('sm')]: {
        width: '100px !important',
        height: '100px',

        float: 'left',
        marginRight: '10px',
        minWidth: 0,
        minHeight: 0,
    },
    [theme.breakpoints.up('md')]: {
        width: '125px !important',
        height: '125px',
        minHeight: '125px',

        float: 'left',
    },
    [theme.breakpoints.up('lg')]: {
        width: '130px !important',
        height: '130px',
        minHeight: '130px',
        float: 'left',
    },
}));

const StyledCitationContainer = styled('div', {
    shouldForwardProp: prop => prop !== 'renderThumbnails',
})(({ theme, renderThumbnails }) => ({
    ...(renderThumbnails && {
        display: 'inline-block',
        float: 'left',
        [theme.breakpoints.down('md')]: {
            width: '100%',
            marginBottom: '10px',
        },
        [theme.breakpoints.up('sm')]: {
            width: 'calc(100% - 130px)',
            minWidth: '280px',
        },
        [theme.breakpoints.up('md')]: {
            width: 'calc(100% - 135px)',
        },
        [theme.breakpoints.up('lg')]: {
            width: 'calc(100% - 140px)',
        },
    }),
}));

const classes = {
    imageListItemRoot: theme => ({
        [theme.breakpoints.down('lg')]: {
            width: '100% !important',
        },
    }),
    imageListItemImage: theme => ({
        [theme.breakpoints.down('md')]: {
            width: '50vw !important',
            height: '50vw !important',
            minWidth: '50vw',
            minHeight: '50vw',
        },
        [theme.breakpoints.up('sm')]: {
            width: '100px !important',
            height: '100px !important',
            minHeight: '100px',
            minWidth: '100px',
        },
        [theme.breakpoints.up('md')]: {
            width: '125px !important',
            height: '125px !important',
            minHeight: '125px',
            minWidth: '125px',
        },
        [theme.breakpoints.up('lg')]: {
            width: '130px !important',
            height: '130px !important',
            minHeight: '130px',
            minWidth: '130px',
        },
    }),
};

export class PublicationCitation extends PureComponent {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        citationStyle: PropTypes.string,
        className: PropTypes.string,
        customActions: PropTypes.array,
        hideCitationCounts: PropTypes.bool,
        hideCitationText: PropTypes.bool,
        hideContentIndicators: PropTypes.bool,
        hideCountDiff: PropTypes.bool,
        hideCountTotal: PropTypes.bool,
        hideLinks: PropTypes.bool,
        hideTitle: PropTypes.bool,
        hideViewFullStatisticsLink: PropTypes.bool,
        history: PropTypes.object.isRequired,
        location: PropTypes.object,
        publication: PropTypes.object.isRequired,
        publicationsLoading: PropTypes.bool,
        isPublicationDeleted: PropTypes.bool,
        showAdminActions: PropTypes.bool,
        showDefaultActions: PropTypes.bool,
        showMetrics: PropTypes.bool,
        showSourceCountIcon: PropTypes.bool,
        showSources: PropTypes.bool,
        showUnpublishedBufferFields: PropTypes.bool,
        showImageThumbnails: PropTypes.bool,
        security: PropTypes.object,
        theme: PropTypes.any,
    };
    static defaultProps = {
        citationStyle: 'notset',
        className: '',
        hideCitationCounts: false,
        hideCitationText: false,
        hideContentIndicators: false,
        hideCountDiff: false,
        hideCountTotal: false,
        hideLinks: false,
        hideTitle: false,
        hideViewFullStatisticsLink: false,
        showAdminActions: false,
        showDefaultActions: false,
        showSourceCountIcon: false,
        showSources: false,
        showUnpublishedBufferFields: false,
        isPublicationDeleted: false,
        showImageThumbnails: false,
        security: { isAdmin: false, isAuthor: false },
    };

    constructor(props) {
        super(props);
        // keep a list of all available citations
        this.citationComponents = {
            AudioDocumentCitation,
            BookChapterCitation,
            BookCitation,
            ConferencePaperCitation,
            ConferenceProceedingsCitation,
            CreativeWorkCitation,
            DataCollectionCitation,
            DepartmentTechnicalReportCitation,
            DesignCitation,
            DigilibImageCitation,
            GenericDocumentCitation,
            ImageDocumentCitation,
            JournalArticleCitation,
            JournalCitation,
            ManuscriptCitation,
            NewspaperArticleCitation,
            PatentCitation,
            PreprintCitation,
            ResearchReportCitation,
            SeminarPaperCitation,
            ThesisCitation,
            VideoDocumentCitation,
            WorkingPaperCitation,
        };

        // get default actions from locale
        this.defaultActions = locale.components.publicationCitation.defaultActions;
    }

    _handleDefaultActions = action => {
        const { history, publication } = this.props;
        /* istanbul ignore else  */
        if (action === 'fixRecord') {
            history.push(pathConfig.records.fix(publication.rek_pid));
        }
    };

    hasPublicationAdvisoryStatement = publication => {
        // eslint-disable-next-line camelcase
        return !!publication.fez_record_search_key_advisory_statement?.rek_advisory_statement;
    };
    showPublicationImage = showImageThumbnails => {
        const { publication } = this.props;
        return (
            showImageThumbnails &&
            (getWhiteListed(publication, imageConfig) || this.hasPublicationAdvisoryStatement(publication))
        );
    };

    renderPublicationImage = (theme, publication, security) => {
        return (
            <StyledPublicationImageWrapper
                id={`publication-image-parent-${publication.rek_pid}`}
                data-testid={`publication-image-parent-${publication.rek_pid}`}
            >
                <ImageGalleryItem
                    key={publication.rek_pid}
                    item={publication}
                    lazyLoading={imageConfig.thumbnailImage.defaultLazyLoading}
                    itemWidth={imageConfig.thumbnailImage.defaultWidth}
                    itemHeight={imageConfig.thumbnailImage.defaultHeight}
                    classes={{
                        imageListItem: { root: classes.imageListItemRoot(theme) },
                        imageListItemImage: classes.imageListItemImage(theme),
                    }}
                    security={security}
                    component="div"
                    withTitle={false}
                />
            </StyledPublicationImageWrapper>
        );
    };

    renderTitle = () => {
        const { publication, hideLinks } = this.props;
        return publication.rek_pid && !hideLinks ? (
            <Link to={pathConfig.records.view(publication.rek_pid)}>{parseHtmlToJSX(publication.rek_title)}</Link>
        ) : (
            parseHtmlToJSX(publication.rek_title)
        );
    };

    renderCitation = publicationTypeId => {
        const { publication, hideLinks, citationStyle } = this.props;
        const filteredPublicationType = publicationTypeId
            ? publicationTypes(this.citationComponents)[publicationTypeId]
            : null;

        return (filteredPublicationType || {}).citationComponent ? (
            React.createElement(filteredPublicationType.citationComponent, {
                publication: publication,
                hideDoiLink: hideLinks,
                citationStyle: citationStyle,
            })
        ) : (
            <div>Citation display not available for {publicationTypeId}</div>
        );
    };

    renderActions = actions => {
        const { publication, showDefaultActions, publicationsLoading } = this.props;
        const pid = publication && publication.rek_pid && publication.rek_pid.replace(':', '');
        const primaryButtonDisabled =
            !publication.rek_pid &&
            !publication.fez_record_search_key_author &&
            !publication.fez_record_search_key_author_id &&
            !publication.fez_record_search_key_contributor &&
            !publication.fez_record_search_key_contributor_id;

        return actions && actions.length > 0
            ? actions.map((action, index) => {
                  const testId = `publication-action-${pid}`;
                  const buttonProps = {
                      color: 'primary',
                      fullWidth: true,
                      disabled: action.disabled,
                      children: action.label,
                      className: `publicationAction buttonOrder${index}`,
                      onClick: () =>
                          showDefaultActions
                              ? this._handleDefaultActions(action.key)
                              : action.handleAction(publication),
                  };
                  return (
                      <Grid item xs={12} sm="auto" key={`action_key_${index}`}>
                          {action.primary ? (
                              <Button
                                  {...buttonProps}
                                  disabled={!!publicationsLoading || primaryButtonDisabled}
                                  classes={{ label: pid, root: pid }}
                                  variant="contained"
                                  data-analyticsid={`${testId}-primary`}
                                  data-testid={`${testId}-primary`}
                              >
                                  {action.label}
                                  {!!publicationsLoading && (
                                      <CircularProgress
                                          size={12}
                                          sx={{ marginLeft: '12px', marginTop: '-2px' }}
                                          thickness={3}
                                          color={'secondary'}
                                          variant={'indeterminate'}
                                          aria-label="Waiting for records to finish loading"
                                      />
                                  )}
                              </Button>
                          ) : (
                              <Button
                                  disabled={!!publicationsLoading}
                                  classes={{ label: pid, root: pid }}
                                  variant="text"
                                  {...buttonProps}
                                  data-testid={`${testId}-secondary`}
                              >
                                  {action.label}
                                  {!!publicationsLoading && (
                                      <CircularProgress
                                          size={12}
                                          sx={{ marginLeft: '12px', marginTop: '-2px' }}
                                          thickness={3}
                                          color={'secondary'}
                                          variant={'indeterminate'}
                                          aria-label="Waiting for records to finish loading"
                                      />
                                  )}
                              </Button>
                          )}
                      </Grid>
                  );
              })
            : null;
    };

    renderSources = () => {
        const { publication } = this.props;
        return (
            <React.Fragment>
                {locale.components.publicationCitation.publicationSourcesLabel}
                {publication.sources.map((source, index) => {
                    const sourceConfig = locale.global.sources[source.source];
                    return (
                        <ExternalLink
                            id={`publication-source-${source.source}`}
                            key={'source_' + index}
                            className="publicationSource"
                            href={sourceConfig.externalUrl.replace('[id]', source.id)}
                            aria-label={locale.global.linkWillOpenInNewWindow.replace(
                                '[destination]',
                                sourceConfig.title,
                            )}
                        >
                            {sourceConfig.title}
                        </ExternalLink>
                    );
                })}
            </React.Fragment>
        );
    };

    render() {
        const {
            customActions,
            hideCitationCounts,
            hideCitationText,
            hideContentIndicators,
            hideCountDiff,
            hideCountTotal,
            hideTitle,
            hideViewFullStatisticsLink,
            location,
            publication,
            showAdminActions,
            showDefaultActions,
            showMetrics,
            showSourceCountIcon,
            showSources,
            showUnpublishedBufferFields,
            isPublicationDeleted,
            showImageThumbnails,
            security,
            theme,
        } = this.props;
        const txt = locale.components.publicationCitation;
        const recordValue = showMetrics && publication.metricData;
        const renderThumbnails = this.showPublicationImage(showImageThumbnails);
        return (
            <div className="publicationCitation">
                {renderThumbnails && this.renderPublicationImage(theme, publication, security)}
                <StyledCitationContainer
                    id={`publication-citation-parent-${publication.rek_pid}`}
                    data-testid={`publication-citation-parent-${publication.rek_pid}`}
                    renderThumbnails={renderThumbnails}
                >
                    <Grid container spacing={0}>
                        <Grid item xs>
                            <Grid container spacing={0}>
                                {!hideTitle ? (
                                    <Grid item xs style={{ minWidth: 1 }}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            lineHeight={1}
                                            letterSpacing={0}
                                            mb={'6px'}
                                            mr={'12px'}
                                            sx={{
                                                overflowWrap: 'break-word !important',
                                            }}
                                            className={'PublicationCitation-citationTitle'}
                                        >
                                            {this.renderTitle()}
                                        </Typography>
                                    </Grid>
                                ) : (
                                    <Grid item xs />
                                )}
                                {showMetrics && (
                                    <Grid item xs={12} sm="auto" className="citationMetrics">
                                        <ExternalLink
                                            id={`my-trending-pubs-${recordValue.source}`}
                                            href={recordValue.citation_url}
                                            title={txt.linkWillOpenInNewWindow.replace(
                                                '[destination]',
                                                txt.myTrendingPublications.sourceTitles[recordValue.source],
                                            )}
                                            aria-label={txt.linkWillOpenInNewWindow.replace(
                                                '[destination]',
                                                txt.myTrendingPublications.sourceTitles[recordValue.source],
                                            )}
                                            openInNewIcon={false}
                                        >
                                            <Grid container>
                                                {showSourceCountIcon && (
                                                    <Grid item>
                                                        <span className={`fez-icon ${recordValue.source} xxxlarge`} />
                                                        <Typography variant="h6">{recordValue.count}</Typography>
                                                    </Grid>
                                                )}
                                                {!showSourceCountIcon && !hideCountTotal && (
                                                    <Grid item>
                                                        <Typography variant="h6" color="inherit" className="count">
                                                            {Math.round(recordValue.count)}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                                {!hideCountDiff && (
                                                    <Grid item>
                                                        <Typography
                                                            variant="h6"
                                                            color="inherit"
                                                            className="difference"
                                                            title={
                                                                txt.myTrendingPublications.trendDifferenceShares[
                                                                    recordValue.source
                                                                ]
                                                            }
                                                        >
                                                            +{Math.round(recordValue.difference)}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </ExternalLink>
                                    </Grid>
                                )}
                                {!hideCitationText && (
                                    <Grid
                                        item
                                        xs={12}
                                        sx={theme => ({
                                            ...theme.typography.caption,
                                            color: theme.typography.body2.color,
                                            marginBottom: '6px',
                                        })}
                                    >
                                        {this.renderCitation(publication.rek_display_type)}
                                    </Grid>
                                )}
                                {showUnpublishedBufferFields && (
                                    <Grid item xs={12}>
                                        <UnpublishedBufferCitationView publication={publication} />
                                    </Grid>
                                )}
                                {(!hideCitationCounts || !!showAdminActions) && (
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center">
                                            {!hideCitationCounts && (
                                                <Grid
                                                    item
                                                    xs="auto"
                                                    sx={{ '&.MuiGrid-root': { flexGrow: 1, whiteSpace: 'nowrap' } }}
                                                >
                                                    <CitationCounts
                                                        publication={publication}
                                                        hideViewFullStatisticsLink={hideViewFullStatisticsLink}
                                                    />
                                                </Grid>
                                            )}
                                            {!!showAdminActions && (
                                                <Grid item>
                                                    <AdminActions
                                                        publication={publication}
                                                        isRecordDeleted={isPublicationDeleted}
                                                        navigatedFrom={
                                                            (location.hash && location.hash.replace('#', '')) ||
                                                            `${location.pathname}${location.search}`
                                                        }
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>
                                )}
                                {showSources && publication.sources && (
                                    <Grid item xs={12}>
                                        <Typography gutterBottom variant="caption">
                                            {this.renderSources()}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        {!hideContentIndicators &&
                            publication.fez_record_search_key_content_indicator &&
                            publication.fez_record_search_key_content_indicator.length > 0 && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="caption"
                                        id="rek-content-indicator"
                                        data-testid="rek-content-indicator"
                                    >
                                        <Box sx={{ fontWeight: 400, marginRight: '0.5px' }}>
                                            {locale.components.contentIndicators.label}:
                                        </Box>
                                        {publication.fez_record_search_key_content_indicator
                                            .map(item => item.rek_content_indicator_lookup)
                                            .join(locale.components.contentIndicators.divider)}
                                    </Typography>
                                </Grid>
                            )}
                    </Grid>
                    {(showDefaultActions || customActions) && (
                        <StyledGridActionButtons container spacing={1}>
                            <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />

                            {this.renderActions(showDefaultActions ? this.defaultActions : customActions)}
                        </StyledGridActionButtons>
                    )}
                </StyledCitationContainer>
                <Divider sx={{ marginBottom: '12px', marginTop: '12px', clear: 'both' }} />
            </div>
        );
    }
}

export default withTheme()(PublicationCitation);
