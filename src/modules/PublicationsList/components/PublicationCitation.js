import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
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

    componentDidMount() {
        // TODO: fix this hack!
        // catch scrolling event of scrolled container (which is not a window) to set position of autosuggest list when user scrolls
        // another solution, close the box when user tries to scroll
        const div = document.querySelector('div.layout-fill.align-stretch');
        div.addEventListener('scroll', this.handleParentContainerScroll.bind(this));
    }

    componentWillUnmount() {
        const div = document.querySelector('div.layout-fill.align-stretch');
        div.removeEventListener('scroll', this.handleParentContainerScroll.bind(this));
    }

    handleParentContainerScroll() {
        if (this.refs.actionsMenu) this.refs.actionsMenu.close();
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

    _handleDefaultActions = (event, menuItem) => {
        switch (menuItem.key) {
            case 'fullMetrics':
                // open full metrics in a new tab
                const win = window.open(`https://app.library.uq.edu.au/#/authors/view/${this.props.publication.rek_pid}`, '_blank');
                if (win) win.focus();
                break;
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
        const actions = this.props.customActions && this.props.customActions.length > 0 ?
            this.props.customActions.map((action, index) => {
                return (
                    <div className="column is-narrow" key={index}>
                        {index === 0 ? (
                            <RaisedButton
                                secondary
                                label={action.label}
                                className={`publicationAction buttonOrder${index}`}
                                onTouchTap={() => (action.handleAction(this.props.publication))}
                            />
                        ) : (
                            <FlatButton
                                secondary
                                label={action.label}
                                className={`publicationAction buttonOrder${index}`}
                                onTouchTap={() => (action.handleAction(this.props.publication))}
                            />
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
                    {
                        this.props.showDefaultActions && this.props.publication.rek_pid &&
                        <div className="column is-narrow" style={{margin: '-12px -12px 0 12px'}}>
                            <IconMenu
                                ref="actionsMenu"
                                onItemTouchTap={this._handleDefaultActions}
                                iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                                targetOrigin={{horizontal: 'left', vertical: 'top'}}>
                                {
                                    this.defaultActions.map(item => {
                                        return (<MenuItem {...item} />);
                                    })
                                }
                            </IconMenu>
                        </div>
                    }
                </div>

                {
                    this.props.customActions && this.props.customActions.length > 0 &&
                    <div className="publicationActions columns is-gapless">
                        <div className="column is-hidden-mobile"/>
                        {actions}
                    </div>
                }
            </div>
        );
    }
}
