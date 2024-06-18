import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class CreativeWorkCitation extends Component {
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
            title: this.props.publication.rek_title,
            placeOfPublication: this.props.publication.fez_record_search_key_place_of_publication
                ? this.props.publication.fez_record_search_key_place_of_publication.rek_place_of_publication
                : null,
            publisher: this.props.publication.fez_record_search_key_publisher
                ? this.props.publication.fez_record_search_key_publisher.rek_publisher
                : null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for Creative Work
        // {Creator}{Publication Year| (|).}<i>{Title| |.}</i>{Place of Publication| |:}{Publisher| |.}
        return (
            <div className="citationContent citationCreativeWork">
                {/* {Creator} */}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Publication Year| (|).} */}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Place of Publication| |:} */}
                <Partials.CitationView
                    className="citationPlaceOfPublication"
                    value={record.placeOfPublication}
                    suffix=":"
                />

                {/* {Publisher| |.} */}
                <Partials.CitationView className="citationPublisher" value={record.publisher} />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
