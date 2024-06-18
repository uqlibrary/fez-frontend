import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class ImageDocumentCitation extends Component {
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
            source: this.props.publication.fez_record_search_key_source
                ? this.props.publication.fez_record_search_key_source.rek_source
                : null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for Image Document
        // {Creator}{Publication Year| (|).}<i>{Title| |.}</i>{Source| |.}

        return (
            <div className="citationContent citationImageDocument">
                {/* {Creator} */}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Publication Year| (|).} */}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Source| |.} */}
                <Partials.CitationView className="citationSource" value={record.source} />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
