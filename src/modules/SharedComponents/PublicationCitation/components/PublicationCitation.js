import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router-dom';

import {locale} from 'locale';
import {routes, publicationTypes} from 'config';

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
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

export default class PublicationCitation extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        showDefaultActions: PropTypes.bool,
        showSources: PropTypes.bool,
        customActions: PropTypes.array,
        className: PropTypes.string,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        hideTitle: PropTypes.bool,
    };

    static defaultProps = {
        showDefaultActions: false,
        showSources: false,
        className: '',
        hideTitle: false
    };

    constructor(props) {
        super(props);
        // keep a list of all available citations
        this.citationComponents = {BookChapterCitation, JournalArticleCitation, BookCitation, ConferencePaperCitation,
            AudioDocumentCitation, GenericDocumentCitation, ResearchReportCitation, PreprintCitation, SeminarPaperCitation,
            CreativeWorkCitation, ManuscriptCitation, DepartmentTechnicalReportCitation, ImageDocumentCitation, DesignCitation,
            DigilibImageCitation, WorkingPaperCitation, VideoDocumentCitation, JournalCitation, ConferenceProceedingsCitation,
            ThesisCitation, NewspaperArticleCitation, PatentCitation, DataCollectionCitation};

        // get default actions from locale
        this.defaultActions = locale.components.publicationCitation.defaultActions;
    }

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps.publication) !== JSON.stringify(this.props.publication);
    }

    _handleDefaultActions = (action) => {
        switch (action) {
            case 'fixRecord':
                this.props.history.push(routes.pathConfig.records.fix(this.props.publication.rek_pid));
                this.props.actions.setFixRecord(this.props.publication);
                break;
            case 'shareRecord':
                // TODO: display share interface
                console.log('share this record');
                break;
            default:
                // do nothing
                break;
        }
    };

    viewRecord = () => {
        this.props.actions.setRecordToView(this.props.publication);
    }

    renderTitle = () => {
        return this.props.publication.rek_pid
            ? (<Link to={routes.pathConfig.records.view(this.props.publication.rek_pid)} onClick={this.viewRecord}>{this.props.publication.rek_title}</Link>)
            : (this.props.publication.rek_title);
    }

    renderCitation = (publicationTypeId) => {
        const filteredPublicationType = publicationTypeId
            ? publicationTypes(this.citationComponents).filter((item) => {
                return item.id === publicationTypeId;
            })
            : null;

        return filteredPublicationType && filteredPublicationType.length > 0 && filteredPublicationType[0].citationComponent
            ? React.createElement(filteredPublicationType[0].citationComponent, {publication: this.props.publication})
            : (<div>Citation display not available for {publicationTypeId}</div>);
    }

    renderActions = (actions) => {
        return actions && actions.length > 0
            ? actions.map((action, index) => {
                const buttonProps = {
                    secondary: true,
                    fullWidth: true,
                    disabled: action.disabled,
                    label: action.label,
                    className: `publicationAction buttonOrder${index}`,
                    onTouchTap: () => (this.props.showDefaultActions
                        ? this._handleDefaultActions(action.key)
                        : action.handleAction(this.props.publication))
                };
                return (
                    <div className="column is-narrow" key={`action_key_${index}`}>
                        {
                            action.primary
                                ? (<RaisedButton {...buttonProps}/>)
                                : (<FlatButton {...buttonProps}/>)
                        }
                    </div>
                );
            })
            : null;
    }

    renderSources = () => {
        return (
            <div className="publicationSources">
                {locale.components.publicationCitation.publicationSourcesLabel}
                {
                    this.props.publication.sources.map((source, index) => {
                        const sourceConfig = locale.global.sources[source.source];
                        return (
                            <ExternalLink
                                key={'source_' + index}
                                className="publicationSource"
                                href={sourceConfig.externalUrl.replace('[id]', source.id)}
                                aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', sourceConfig.title)}>
                                {sourceConfig.title}
                            </ExternalLink>
                        );
                    })
                }
            </div>
        );
    }

    render() {
        return (
            <div className={`publicationCitation ${this.props.className}`}>
                <div className="columns is-gapless is-mobile">
                    <div className="column">
                        {
                            !this.props.hideTitle &&
                            <h3 className="publicationTitle">
                                {this.renderTitle()}
                            </h3>
                        }

                        {this.renderCitation(this.props.publication.rek_display_type)}

                        {<CitationCounts publication={this.props.publication} />}

                        {/* display publication source (eg from espace/pubmed/crossref/etc */}
                        {this.props.showSources && this.props.publication.sources && this.renderSources()}
                    </div>
                </div>
                {
                    (this.props.showDefaultActions || this.props.customActions) &&
                    <div className="publicationActions columns is-gapless">
                        <div className="column is-hidden-mobile"/>
                        {
                            this.renderActions(this.props.showDefaultActions ? this.defaultActions : this.props.customActions)
                        }
                    </div>
                }
            </div>
        );
    }
}
