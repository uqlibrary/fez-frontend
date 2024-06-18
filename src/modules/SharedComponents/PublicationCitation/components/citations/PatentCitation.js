import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class PatentCitation extends Component {
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
            patentNumber: this.props.publication.fez_record_search_key_patent_number
                ? this.props.publication.fez_record_search_key_patent_number.rek_patent_number
                : null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for Patent
        // {Creator}{Date of issue| (|).|y}<i>{Patent title| |.}</i>{Patent number| |.}
        return (
            <div className="citationContent citationPatent">
                {/* {Creator} */}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Date of issue| (|).|y} */}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* {Title of patent} */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} prefix=" " suffix="." />

                {/* {Patent number| |.}*/}
                <Partials.CitationView
                    className="citationPatentNumber"
                    value={record.patentNumber}
                    prefix=" "
                    suffix="."
                />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
