import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class DataCollectionCitation extends Component {
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
            publisher: this.props.publication.fez_record_search_key_publisher
                ? this.props.publication.fez_record_search_key_publisher.rek_publisher
                : null,
            collectionType: this.props.publication.rek_display_type_lookup || null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for DataCollection
        // {Creator name}{Publication Year| (|).}<i>{Dataset Title| |.}</i>{Publisher| |.} Collection Type. {doi| doi:|}

        return (
            <div className="citationContent citationDataCollection">
                {/* {Creator} */}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                    suffix=""
                />

                {/* {Publication Year| (|).} */}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Dataset Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Publisher| |.} */}
                <Partials.CitationView className="citationPublisher" value={record.publisher} />

                {/* {Collection Type| (|).} */}
                <Partials.CitationView className="citationCollectionType" value={record.collectionType} />

                {/* {doi| doi:|} */}
                <Partials.DoiCitationView doi={record.doi} hideDoiLink={this.props.hideDoiLink} />
            </div>
        );
    }
}
