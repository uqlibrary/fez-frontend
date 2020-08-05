import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class AudioDocumentCitation extends Component {
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
            publisher: this.props.publication.fez_record_search_key_publisher
                ? this.props.publication.fez_record_search_key_publisher.rek_publisher
                : null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
            series: this.props.publication.fez_record_search_key_series
                ? this.props.publication.fez_record_search_key_series.rek_series
                : null,
        };

        // eSpace citation view for Audio
        // {Creator}{Publication Year| (|).} <i>{Title| |.}</i> {Publisher| |.}{Series| |.} {doi| doi:|}
        return (
            <div className="citationContent citationAudio">
                {/* {Creator}*/}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Publication Year| (|).} */}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Publisher| |.}*/}
                <Partials.CitationView className="citationPublisher" value={record.publisher} />

                {/* {Series| |.} */}
                <Partials.CitationView className="citationSeries" value={record.series} />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
