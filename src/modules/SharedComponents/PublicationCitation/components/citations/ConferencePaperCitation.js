import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class ConferencePaperCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        hideDoiLink: PropTypes.bool,
        citationStyle: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const record = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            name: this.props.publication.fez_record_search_key_conference_name
                ? this.props.publication.fez_record_search_key_conference_name.rek_conference_name
                : null,
            location: this.props.publication.fez_record_search_key_conference_location
                ? this.props.publication.fez_record_search_key_conference_location.rek_conference_location
                : null,
            dates: this.props.publication.fez_record_search_key_conference_dates
                ? this.props.publication.fez_record_search_key_conference_dates.rek_conference_dates
                : null,
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

        // eSpace citation view for conference paper
        return (
            <div className="citationContent citationConferencePaper">
                {/* {Author}*/}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Publication Year| (|).}*/}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i>*/}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Conference Name| |,}*/}
                <Partials.CitationView className="citationConferenceName" value={record.name} suffix=", " />
                {/* {Conference Location| |,}*/}

                <Partials.CitationView className="citationConferenceLocation" value={record.location} suffix=", " />

                {/* {Conference Date| |.}*/}
                <Partials.CitationView className="citationConferenceDates" value={record.dates} />

                {/* {Place of Publication| |:} */}
                <Partials.CitationView
                    className="citationPlaceOfPublication"
                    value={record.placeOfPublication}
                    suffix=":"
                />

                {/* {Publisher| |.} */}
                <Partials.CitationView className="citationPublisher" value={record.publisher} />

                {/* {doi| doi:|} */}
                <Partials.DoiCitationView doi={record.doi} hideDoiLink={this.props.hideDoiLink} />
            </div>
        );
    }
}
