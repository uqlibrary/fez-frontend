import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import YearCitationView from './YearCitationView';

export default class GenericDocumentCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        // Check if the title exists and if so, just check its last char for a full stop or not.
        const title = this.props.publication.rek_title && (this.props.publication.rek_title.substr(this.props.publication.rek_title.length - 1) === '.' ? this.props.publication.rek_title : this.props.publication.rek_title + '.');
        // Check if there is a publisher, and if so check that the last char is a full stop, or not.
        const publisher = this.props.publication.fez_record_search_key_publisher && (this.props.publication.fez_record_search_key_publisher.rek_publisher.substr(this.props.publication.fez_record_search_key_publisher.rek_publisher.length - 1) === '.' ? this.props.publication.fez_record_search_key_publisher.rek_publisher : this.props.publication.fez_record_search_key_publisher.rek_publisher + '.');

        const genericDocument = {
            id: this.props.publication.rek_pid,
            publisher: publisher,
            title: title
        };

        // eSpace citation view for Generic article
        // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Publisher| |.}

        return (
            <div className="citationContent citationGenericDocument">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>
                <AuthorsCitationView publication={this.props.publication}/>
                <YearCitationView publication={this.props.publication}/>.
                <span className="citationTitle"><i> {genericDocument.title}</i></span>
                {
                    genericDocument.publisher &&
                    <span className="citationPublisher"> {genericDocument.publisher}</span>
                }
            </div>
        );
    }
}
