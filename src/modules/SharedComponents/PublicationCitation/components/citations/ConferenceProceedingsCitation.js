import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class ConferenceProceedingsCitation extends Component {
    static propTypes = {
        citationStyle: PropTypes.string,
        hideDoiLink: PropTypes.bool,
        publication: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const record = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            conferenceName: this.props.publication.fez_record_search_key_conference_name
                ? this.props.publication.fez_record_search_key_conference_name.rek_conference_name
                : null,
            conferenceLocation: this.props.publication.fez_record_search_key_conference_location
                ? this.props.publication.fez_record_search_key_conference_location.rek_conference_location
                : null,
            conferenceDate: this.props.publication.fez_record_search_key_conference_dates
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

        // eSpace citation view for Conference Proceedings
        // {Editor/s || ed.}{Publication Year| (|).}<i>{Title of proceedings| |.}</i>{Conference Name| |,}{Conference Location| |,}{Conference Date| |.}{Place of Publication| |:}{Publisher| |.} {doi| https://doi.org/||}

        return (
            <div className="citationContent citationDesign">
                {/* {Editor/s || ed.} */}
                <Partials.EditorsCitationView
                    citationStyle={this.props.citationStyle}
                    prefix=""
                    publication={this.props.publication}
                    suffix=" ed. "
                />

                {/* {Publication Year| (|).} */}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title of proceedings| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Conference Name| |,} */}
                <Partials.CitationView className="citationConferenceName" value={record.conferenceName} suffix=", " />

                {/* {Conference Location| |,} */}
                <Partials.CitationView
                    className="citationConferenceLocation"
                    value={record.conferenceLocation}
                    suffix=", "
                />

                {/* {Conference Date| |.} */}
                <Partials.CitationView className="citationConferenceDate" value={record.conferenceDate} />

                {/* {Place of Publication| |:} */}
                <Partials.CitationView
                    className="citationPlaceOfPublication"
                    value={record.placeOfPublication}
                    suffix=": "
                />

                {/* {Publisher| |.} */}
                <Partials.CitationView className="citationPublisher" value={record.publisher} />

                {/* {doi| https://doi.org/||} */}
                <Partials.DoiCitationView doi={record.doi} hideDoiLink={this.props.hideDoiLink} />
            </div>
        );
    }
}
