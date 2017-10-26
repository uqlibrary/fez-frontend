import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import * as Partials from './partials';

export default class GenericDocumentCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const genericDocument = {
            id: this.props.publication.rek_pid,
            publisher: this.props.publication.fez_record_search_key_publisher ? this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            title: this.props.publication ? this.props.publication.rek_title : null
        };

        // eSpace citation view for Generic article
        // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Publisher| |.}

        return (
            <div className="citationContent citationGenericDocument">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                <Partials.AuthorsCitationView publication={this.props.publication}/>

                <Partials.YearCitationView publication={this.props.publication}/>.

                <span className="citationTitle">{genericDocument.title}</span>.

                {
                    genericDocument.publisher &&
                    <span className="citationPublisher"> {genericDocument.publisher}.</span>
                }
            </div>
        );
    }
}
