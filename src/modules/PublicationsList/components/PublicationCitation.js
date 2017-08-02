import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import {publicationTypes} from 'config';

// citations for different publication types
import CitationCounts from './citations/CitationCounts';
import JournalArticleCitation from './citations/JournalArticleCitation';

/*
 * @props:
 *   publication {object} item to be displayed
 *   actions {array} of {label: string, actionHandler: function} which will be rendered as FlatButtons
 * */
export default class PublicationCitation extends Component {

    static propTypes = {
        publication: PropTypes.object.isRequired,
        actions: PropTypes.array
    };

    constructor(props) {
        super(props);

        // keep a list of all available citations
        this.citationComponents = {JournalArticleCitation};
    }

    _renderCitation = (publicationTypeId) => {
        const filteredPublicationType = publicationTypeId ?
            publicationTypes(this.citationComponents).filter((item) => { return item.id === publicationTypeId; }) : null;
        return filteredPublicationType && filteredPublicationType.length > 0 && filteredPublicationType[0].citationComponent ?
            React.createElement(filteredPublicationType[0].citationComponent, {publication: this.props.publication}) : <div>Citation display not available for {publicationTypeId}</div>;
    }

    render() {
        const actions = this.props.actions && this.props.actions.length > 0 ?
            this.props.actions.map((action, index) => {
                return (
                    <FlatButton
                      fullWidth
                        key={index}
                        secondary
                        label={action.label}
                        className="publicationAction"
                        onTouchTap={() => (action.handleAction(this.props.publication))}
                    />
                );
            }) : null;
        return (
            <div className="publicationCitation">
                <h3 className="title is-5 publicationTitle">{this.props.publication.rek_title}</h3>

                {
                    this._renderCitation(this.props.publication.rek_display_type)
                }

                <CitationCounts publication={this.props.publication}/>

                {
                    this.props.actions && this.props.actions.length > 0 &&
                    <div className="publicationActions columns is-gapless">
                        <div className="column is-hidden-mobile" />
                            <div className="column is-narrow">
                                {actions}
                            </div>
                    </div>
                }
            </div>
        );
    }
}
