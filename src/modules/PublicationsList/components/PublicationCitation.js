import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {publicationTypes, locale} from 'config';

// citations for different publication types
import CitationCounts from './citations/CitationCounts';
import JournalArticleCitation from './citations/JournalArticleCitation';

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
        this.citationComponents = {JournalArticleCitation};
        // get default actions from locale
        this.defaultActions = locale.components.publicationCitation.defaultActions;
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
    }

    render() {
        const actions = this.props.showDefaultActions ? this.defaultActions : this.props.customActions;
        const renderedActions = actions && actions.length > 0 ?
            actions.map((action, index) => {
                return (
                    <div className="column is-narrow" key={index}>
                        {
                            action.primary ? (
                                <RaisedButton
                                    secondary
                                    label={action.label}
                                    className={`publicationAction buttonOrder${index}`}
                                    onTouchTap={() => (
                                        this.props.showDefaultActions
                                            ? this._handleDefaultActions(action.key)
                                            : action.handleAction(this.props.publication)
                                    )}/>
                            ) : (
                                <FlatButton
                                    secondary
                                    label={action.label}
                                    className={`publicationAction buttonOrder${index}`}
                                    onTouchTap={() => (
                                        this.props.showDefaultActions
                                            ? this._handleDefaultActions(action.key)
                                            : action.handleAction(this.props.publication)
                                    )}/>
                            )}
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
                        <CitationCounts publication={this.props.publication}/>
                        {
                            this.props.publication.sources &&
                            <span className="publicationSources">
                                {locale.components.publicationCitation.publicationSourcesLabel}
                                {
                                    this.props.publication.sources.map((source, index) => (
                                        <span key={index} className="publicationSource">{locale.global.sources[source].title}</span>
                                    ))
                                }
                            </span>
                        }
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
