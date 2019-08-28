import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import { locale } from 'locale';
import { routes, publicationTypes } from 'config';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import ReactHtmlParser from 'react-html-parser';
import { withStyles } from '@material-ui/core/styles';

// citations for different publication types
import CitationCounts from './citations/CitationCounts';
import JournalArticleCitation from './citations/JournalArticleCitation';
import BookChapterCitation from './citations/BookChapterCitation';
import BookCitation from './citations/BookCitation';
import ConferencePaperCitation from './citations/ConferencePaperCitation';
import GenericDocumentCitation from './citations/GenericDocumentCitation';
import AudioDocumentCitation from './citations/AudioDocumentCitation';
import ResearchReportCitation from './citations/ResearchReportCitation';
import PreprintCitation from './citations/PreprintCitation';
import SeminarPaperCitation from './citations/SeminarPaperCitation';
import CreativeWorkCitation from './citations/CreativeWorkCitation';
import ManuscriptCitation from './citations/ManuscriptCitation';
import DepartmentTechnicalReportCitation from './citations/DepartmentTechnicalReportCitation';
import ImageDocumentCitation from './citations/ImageDocumentCitation';
import DesignCitation from './citations/DesignCitation';
import DigilibImageCitation from './citations/DigilibImageCitation';
import WorkingPaperCitation from './citations/WorkingPaperCitation';
import VideoDocumentCitation from './citations/VideoDocumentCitation';
import JournalCitation from './citations/JournalCitation';
import PatentCitation from './citations/PatentCitation';
import ConferenceProceedingsCitation from './citations/ConferenceProceedingsCitation';
import ThesisCitation from './citations/ThesisCitation';
import NewspaperArticleCitation from './citations/NewspaperArticleCitation';
import DataCollectionCitation from './citations/DataCollectionCitation';
import { UnpublishedBufferCitationView } from './citations/partials/UnpublishedBufferCitationView';
import AdminActions from './citations/partials/AdminActions';
import CircularProgress from '@material-ui/core/CircularProgress';

export const styles = theme => ({
    divider: {
        marginBottom: 12,
        marginTop: 12,
    },
    citationTitle: {
        lineHeight: 1,
        letterSpacing: 0,
        marginBottom: 6,
        marginRight: 12,
    },
    citationText: {
        ...theme.typography.caption,
        color: theme.typography.body2.color,
        marginBottom: 6,
    },
    citationCounts: {
        whiteSpace: 'nowrap',
    },
    buttonMargin: {
        [theme.breakpoints.down('sm')]: {
            marginTop: 12,
        },
    },
    contentIndicatorTitle: {
        fontWeight: 400,
        marginRight: '0.5ex',
    },
});

export class PublicationCitation extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        publicationsLoading: PropTypes.bool,
        showDefaultActions: PropTypes.bool,
        showSources: PropTypes.bool,
        customActions: PropTypes.array,
        className: PropTypes.string,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        hideTitle: PropTypes.bool,
        showAdminActions: PropTypes.bool,
        showMetrics: PropTypes.bool,
        showSourceCountIcon: PropTypes.bool,
        showUnpublishedBufferFields: PropTypes.bool,
        hideCountDiff: PropTypes.bool,
        hideCountTotal: PropTypes.bool,
        hideViewFullStatisticsLink: PropTypes.bool,
        hideCitationCounts: PropTypes.bool,
        hideLinks: PropTypes.bool,
        hideContentIndicators: PropTypes.bool,
        classes: PropTypes.object,
    };

    static defaultProps = {
        showAdminActions: false,
        showDefaultActions: false,
        showSources: false,
        showSourceCountIcon: false,
        showUnpublishedBufferFields: false,
        className: '',
        hideTitle: false,
        hideLinks: false,
        hideCountDiff: false,
        hideCountTotal: false,
        hideViewFullStatisticsLink: false,
        hideCitationCounts: false,
        hideContentIndicators: false,
    };

    constructor(props) {
        super(props);
        // keep a list of all available citations
        this.citationComponents = {
            BookChapterCitation,
            JournalArticleCitation,
            BookCitation,
            ConferencePaperCitation,
            AudioDocumentCitation,
            GenericDocumentCitation,
            ResearchReportCitation,
            PreprintCitation,
            SeminarPaperCitation,
            CreativeWorkCitation,
            ManuscriptCitation,
            DepartmentTechnicalReportCitation,
            ImageDocumentCitation,
            DesignCitation,
            DigilibImageCitation,
            WorkingPaperCitation,
            VideoDocumentCitation,
            JournalCitation,
            ConferenceProceedingsCitation,
            ThesisCitation,
            NewspaperArticleCitation,
            PatentCitation,
            DataCollectionCitation,
        };

        // get default actions from locale
        this.defaultActions = locale.components.publicationCitation.defaultActions;
    }

    _handleDefaultActions = action => {
        switch (action) {
            case 'fixRecord':
                this.props.history.push(routes.pathConfig.records.fix(this.props.publication.rek_pid));
                break;
            case 'shareRecord':
                // TODO: display share interface
                break;
            default:
                // do nothing
                break;
        }
    };

    renderTitle = () => {
        return this.props.publication.rek_pid && !this.props.hideLinks ? (
            <Link to={routes.pathConfig.records.view(this.props.publication.rek_pid)}>
                {ReactHtmlParser(this.props.publication.rek_title)}
            </Link>
        ) : (
            ReactHtmlParser(this.props.publication.rek_title)
        );
    };

    renderCitation = publicationTypeId => {
        const filteredPublicationType = publicationTypeId
            ? publicationTypes(this.citationComponents)[publicationTypeId]
            : null;

        return (filteredPublicationType || {}).citationComponent ? (
            React.createElement(filteredPublicationType.citationComponent, {
                publication: this.props.publication,
                hideDoiLink: this.props.hideLinks,
            })
        ) : (
            <div>Citation display not available for {publicationTypeId}</div>
        );
    };

    renderActions = actions => {
        const pid =
            this.props.publication && this.props.publication.rek_pid && this.props.publication.rek_pid.replace(':', '');
        return actions && actions.length > 0
            ? actions.map((action, index) => {
                const buttonProps = {
                    color: 'primary',
                    fullWidth: true,
                    disabled: action.disabled,
                    children: action.label,
                    className: `publicationAction buttonOrder${index}`,
                    onClick: () =>
                        this.props.showDefaultActions
                            ? this._handleDefaultActions(action.key)
                            : action.handleAction(this.props.publication),
                };
                return (
                    <Grid item xs={12} sm="auto" key={`action_key_${index}`}>
                        {action.primary ? (
                            <Button
                                disabled={!!this.props.publicationsLoading}
                                classes={{ label: pid, root: pid }}
                                variant="contained"
                                {...buttonProps}
                            >
                                {action.label}
                                {!!this.props.publicationsLoading && (
                                    <CircularProgress
                                        size={12}
                                        style={{ marginLeft: 12, marginTop: -2 }}
                                        thickness={3}
                                        color={'secondary'}
                                        variant={'indeterminate'}
                                        aria-label="Waiting for records to finish loading"
                                    />
                                )}
                            </Button>
                        ) : (
                            <Button
                                disabled={!!this.props.publicationsLoading}
                                classes={{ label: pid, root: pid }}
                                variant="text"
                                {...buttonProps}
                            >
                                {action.label}
                                {!!this.props.publicationsLoading && (
                                    <CircularProgress
                                        size={12}
                                        style={{ marginLeft: 12, marginTop: -2 }}
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
        return (
            <React.Fragment>
                {locale.components.publicationCitation.publicationSourcesLabel}
                {this.props.publication.sources.map((source, index) => {
                    const sourceConfig = locale.global.sources[source.source];
                    return (
                        <ExternalLink
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
        const { classes } = this.props;
        const txt = locale.components.publicationCitation;
        const recordValue = this.props.showMetrics && this.props.publication.metricData;
        return (
            <div className="publicationCitation">
                <Grid container spacing={0}>
                    <Grid item xs>
                        <Grid container spacing={0}>
                            {!this.props.hideTitle ? (
                                <Grid item xs style={{ minWidth: 1 }}>
                                    <Typography variant="h6" component="h6" className={classes.citationTitle}>
                                        {this.renderTitle()}
                                    </Typography>
                                </Grid>
                            ) : (
                                <Grid item xs />
                            )}
                            {this.props.showMetrics && (
                                <Grid item xs={12} sm="auto" className="citationMetrics">
                                    <ExternalLink
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
                                            {this.props.showSourceCountIcon && (
                                                <Grid item>
                                                    <span className={`fez-icon ${recordValue.source} xxxlarge`} />
                                                    <Typography variant="h6">{recordValue.count}</Typography>
                                                </Grid>
                                            )}
                                            {!this.props.showSourceCountIcon && !this.props.hideCountTotal && (
                                                <Grid item>
                                                    <Typography variant="h6" color="inherit" className="count">
                                                        {Math.round(recordValue.count)}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {!this.props.hideCountDiff && (
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
                            <Grid item xs={12} className={classes.citationText}>
                                {this.renderCitation(this.props.publication.rek_display_type)}
                            </Grid>
                            {this.props.showUnpublishedBufferFields && (
                                <Grid item xs={12}>
                                    <UnpublishedBufferCitationView publication={this.props.publication} />
                                </Grid>
                            )}
                            {(!this.props.hideCitationCounts || this.props.showAdminActions) && (
                                <Grid item xs={12}>
                                    <Grid container alignItems="center">
                                        {!this.props.hideCitationCounts && (
                                            <Grid
                                                item
                                                xs="auto"
                                                className={classes.citationCounts}
                                                style={{ flexGrow: 1 }}
                                            >
                                                <CitationCounts
                                                    publication={this.props.publication}
                                                    hideViewFullStatisticsLink={this.props.hideViewFullStatisticsLink}
                                                />
                                            </Grid>
                                        )}
                                        {this.props.showAdminActions && (
                                            <Grid item>
                                                <AdminActions pid={this.props.publication.rek_pid} />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                            {this.props.showSources && this.props.publication.sources && (
                                <Grid item xs={12}>
                                    <Typography gutterBottom variant="caption">
                                        {this.renderSources()}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                {(this.props.showDefaultActions || this.props.customActions) && (
                    <Grid container spacing={8} className={classes.buttonMargin}>
                        <Hidden xsDown>
                            <Grid item xs />
                        </Hidden>
                        {this.renderActions(
                            this.props.showDefaultActions ? this.defaultActions : this.props.customActions,
                        )}
                    </Grid>
                )}
                <Divider className={classes.divider} />
                {!this.props.hideContentIndicators &&
                    this.props.publication.fez_record_search_key_content_indicator &&
                    this.props.publication.fez_record_search_key_content_indicator.length > 0 && (
                    <Grid item xs={12}>
                        <Typography gutterBottom variant="caption">
                            <span className={classes.contentIndicatorTitle}>
                                {locale.components.contentIndicators.label}:
                            </span>
                            {this.props.publication.fez_record_search_key_content_indicator
                                .map(item => item.rek_content_indicator_lookup)
                                .join(locale.components.contentIndicators.divider)}
                        </Typography>
                    </Grid>
                )}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(PublicationCitation);
