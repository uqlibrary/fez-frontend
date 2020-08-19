import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class BookCitation extends Component {
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
            isEditedBook:
                this.props.publication.rek_subtype &&
                this.props.publication.rek_subtype.toLowerCase() === 'edited book',
            title: this.props.publication.rek_title,
            edition: this.props.publication.fez_record_search_key_edition
                ? this.props.publication.fez_record_search_key_edition.rek_edition
                : null,
            series: this.props.publication.fez_record_search_key_series
                ? this.props.publication.fez_record_search_key_series.rek_series
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

        // eSpace citation view for Book
        // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Edition| | ed.}
        // {Place of Publication| |:} {Publisher| |.} {doi| doi:|}
        // Edited Book (subtype: Edited Book)
        // {Editor|| ed.}{Publication Year| (|).}<i>{Title| |.}</i>{Edition| | ed.}
        // {Series Title| |,}{Place of Publication| |:}{Publisher| |.}
        // {doi| doi:|}

        return (
            <div className="citationContent citationBook">
                {/* {Author} */}
                {!record.isEditedBook && (
                    <Partials.AuthorsCitationView
                        citationStyle={this.props.citationStyle}
                        publication={this.props.publication}
                    />
                )}

                {/* {Editor|| ed.} */}
                {record.isEditedBook && (
                    <Partials.EditorsCitationView
                        citationStyle={this.props.citationStyle}
                        prefix=""
                        publication={this.props.publication}
                        suffix=" ed."
                    />
                )}

                {/* {Publication Year| (|).} */}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Edition| | ed.} */}
                <Partials.CitationView className="citationEdition" value={record.edition} suffix=" ed." />

                {/* {Series Title| |,} */}
                {record.isEditedBook && (
                    <Partials.CitationView className="citationSeries" value={record.series} suffix="," />
                )}

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
