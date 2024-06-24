import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class GenericDocumentCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        citationStyle: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const record = {
            id: this.props.publication.rek_pid,
            publisher: this.props.publication.fez_record_search_key_publisher
                ? this.props.publication.fez_record_search_key_publisher.rek_publisher
                : null,
            title: this.props.publication.rek_title ? this.props.publication.rek_title : null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for Generic article
        // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Publisher| |.}
        return (
            <div className="citationContent citationGenericDocument">
                {/* {Author}*/}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Publication Year| (|).}*/}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i>*/}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Publisher| |.} */}
                <Partials.CitationView className="citationPublisher" value={record.publisher} />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
