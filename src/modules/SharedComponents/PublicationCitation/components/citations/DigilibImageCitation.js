import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class DigilibImageCitation extends Component {
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
            datePhotoTaken: this.props.publication.fez_record_search_key_date_photo_taken
                ? this.props.publication.fez_record_search_key_date_photo_taken.rek_date_photo_taken
                : null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for Digilib Image
        // {Photographer}{Date photo taken| (|).}<i>{Title| |.}</i>

        return (
            <div className="citationContent citationDesign">
                {/* {Photographer} */}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Date photo taken| (|).} */}
                <Partials.DateCitationView date={record.datePhotoTaken} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
