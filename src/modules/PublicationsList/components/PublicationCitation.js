import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {publicationTypes, locale} from 'config';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';

// citations for different publication types
import CitationCounts from './citations/CitationCounts';
import JournalArticleCitation from './citations/JournalArticleCitation';
import BookChapterCitation from './citations/BookChapterCitation';
import BookCitation from './citations/BookCitation';
import ConferencePaperCitation from './citations/ConferencePaperCitation';

/*
 * @props:
 *   publication {object} item to be displayed
 *   customActions {array} of {label: string, actionHandler: function} which will be rendered as FlatButtons
 *   showDefaultActions {bool} if set to true will display default actions for records with PID, false by default
 * */
export default class PublicationCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        showDefaultActions: PropTypes.bool,
        customActions: PropTypes.array
    };

    static defaultProps = {
        showDefaultActions: false
    };

    constructor(props) {
        super(props);

        // keep a list of all available citations
        this.citationComponents = {BookChapterCitation, JournalArticleCitation, BookCitation, ConferencePaperCitation};
        // get default actions from locale
        this.defaultActions = locale.components.publicationCitation.defaultActions;
        this._citationId = this._citationId.bind(this);
    }

    _renderCitation = (publicationTypeId) => {
        const filteredPublicationType = publicationTypeId ?
            publicationTypes(this.citationComponents).filter((item) => {
                return item.id === publicationTypeId;
            }) : null;

        return filteredPublicationType && filteredPublicationType.length > 0 && filteredPublicationType[0].citationComponent ?
            React.createElement(filteredPublicationType[0].citationComponent, {publication: this.props.publication}) :
            <div>Citation display not available for {publicationTypeId}</div>;
    }

    _handleDefaultActions = (action) => {
        switch (action) {
            case 'fixRecord':
                // TODO: set current record in store, redirect to fix screen
                console.log('fix this record');
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

    _citationId = (citationSource) => {
        let location = '';
        if(citationSource === 'wos') {
            if(this.props.publication.fez_record_search_key_isi_loc && this.props.publication.fez_record_search_key_isi_loc.rek_isi_loc) {
                location = this.props.publication.fez_record_search_key_isi_loc.rek_isi_loc;
            }
        } else if (citationSource === 'scopus') {
            if(this.props.publication.fez_record_search_key_scopus_id && this.props.publication.fez_record_search_key_scopus_id.rek_scopus_id) {
                location = this.props.publication.fez_record_search_key_scopus_id.rek_scopus_id;
            }
        } else if (citationSource === 'altmetric') {
            if(this.props.publication.rek_altmetric_id) {
                location = this.props.publication.rek_altmetric_id;
            }
        }
        return location;
    };

    render() {
        const actions = this.props.showDefaultActions ? this.defaultActions : this.props.customActions;
        const renderedActions = actions && actions.length > 0 ?
            actions.map((action, index) => {
                const buttonProps = {
                    secondary: true,
                    fullWidth: true,
                    label: action.label,
                    className: `publicationAction buttonOrder${index}`,
                    onTouchTap: () => (
                        this.props.showDefaultActions
                            ? this._handleDefaultActions(action.key)
                            : action.handleAction(this.props.publication)
                    )
                };
                return (
                    <div className="column is-narrow" key={index}>
                        {
                            action.primary ?
                                (<RaisedButton {...buttonProps}/>) : (<FlatButton {...buttonProps}/>)
                        }
                    </div>
                );
            }) : null;
        return (
            <div className="publicationCitation">
                <div className="columns is-gapless is-mobile">
                    <div className="column">
                        <h3 className="title is-5 publicationTitle">{this.props.publication.rek_title}</h3>
                        {
                            this._renderCitation(this.props.publication.rek_display_type)
                        }
                        <CitationCounts publication={this.props.publication} citationId={this._citationId} />
                        {
                            this.props.publication.sources &&
                            <span className="publicationSources">
                                {locale.components.publicationCitation.publicationSourcesLabel}
                                {
                                    this.props.publication.sources.map((source, index) => {
                                        const sourceConfig = locale.global.sources[source.source];
                                        return (
                                            <span key={index}>
                                                <a href={sourceConfig.externalUrl.replace('[ID]', source.id)}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    className="publicationSource"
                                                    aria-label={locale.global.linkWillOpenInNewWindow.replace('[DESTINATION]', sourceConfig.title)}>
                                                    {sourceConfig.title}<ActionOpenInNew
                                                        className="citationOpenUrlIcon"/>
                                                </a>
                                            </span>
                                        );
                                    })
                                }
                            </span>
                        }
                        <span className="citationSources">
                            {(this.props.publication.rek_thomson_citation_count >= 1 ||
                                    this.props.publication.rek_scopus_citation_count >= 1 ||
                                    this.props.publication.rek_altmetric_score >= 1 ) &&
                                locale.components.publicationCitation.publicationCitationLabel}
                            {
                                Object.keys(locale.global.citationSources).map((citationSource, index) => {
                                    const countLocation = locale.global.citationSources[citationSource].countLocation;
                                    const citationTitle = locale.global.citationSources[citationSource].title;
                                    const citationURL = locale.global.citationSources[citationSource].externalCitationUrl;
                                    return(
                                        this.props.publication[countLocation] >= 1 &&
                                        <span key={index}>
                                            <a href={citationURL.replace('[ID]', this._citationId(citationSource))}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                className="publicationSource"
                                                aria-label={locale.global.linkWillOpenInNewWindow.replace('[DESTINATION]', citationSource.title)}
                                            >
                                                {citationTitle + ' (' + this.props.publication[countLocation] + ') '}
                                                <ActionOpenInNew className="citationOpenUrlIcon" />
                                            </a>

                                        </span>
                                    );
                                })
                            }
                        </span>
                    </div>
                </div>
                <div className="publicationActions columns is-gapless">
                    <div className="column is-hidden-mobile"/>
                    {renderedActions}
                </div>
            </div>
        );
    }
}
