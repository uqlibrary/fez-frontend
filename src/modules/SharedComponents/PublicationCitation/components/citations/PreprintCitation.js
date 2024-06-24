import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class PreprintCitation extends Component {
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
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for Preprint
        // {Author}{Year| (|).}<i>{Title| |.}</i>
        return (
            <div className="citationContent citationPreprint">
                {/* {Author}*/}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Year| (|).}*/}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
