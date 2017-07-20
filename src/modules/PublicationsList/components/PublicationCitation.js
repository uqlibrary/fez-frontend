import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

// citations for different publication types
import CitationCounts from './citations/CitationCounts';
import JournalArticleCitation from './citations/JournalArticleCitation';

export default class PublicationCitation extends Component {

    static propTypes = {
        publication: PropTypes.object.isRequired,
        actions: PropTypes.array
    };

    static defaultProps = {
        actions: [
            {buttonLabel: 'Claim this publication'}
        ]
    };

    constructor(props) {
        super(props);
    }

    _renderCitation = (publicationType) => {
        // TODO: publication types management!!!
        switch (publicationType) {
            case 179:
                return (<JournalArticleCitation publication={this.props.publication}/>);
            default:
                return (<div>Citation coming soon for this publication type: {publicationType}</div>);
        }
    }

    render() {
        return (
            <div className="publicationCitation">
                <h3 className="title is-5 publicationTitle">{this.props.publication.rek_title}</h3>

                {
                    this._renderCitation(this.props.publication.rek_display_type)
                }

                <CitationCounts publication={this.props.publication}/>

                {
                    this.props.actions && this.props.actions.length > 0 &&
                    <div className="publicationActions">
                        <FlatButton
                            label="CLAIM"
                            secondary/>
                        <FlatButton
                            label="HIDE"
                            secondary/>
                        <FlatButton
                            label="Bla..."
                            secondary/>
                    </div>
                }
            </div>
        );
    }
}
