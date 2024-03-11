import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class ThesisCitation extends Component {
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
            thesisType: this.props.publication.rek_genre_type || null,
            orgUnit: this.props.publication.fez_record_search_key_org_unit_name
                ? this.props.publication.fez_record_search_key_org_unit_name.rek_org_unit_name
                : null,
            orgName: this.props.publication.fez_record_search_key_org_name
                ? this.props.publication.fez_record_search_key_org_name.rek_org_name
                : null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for Thesis
        // {Author}{Year| (|).}<i>{Title| |.}</i>{Thesis type| |,}{School, Centre or Institute| |,}{Institution| |.} {doi| https://doi.org/|}

        return (
            <div className="citationContent citationThesis">
                {/* {Author}*/}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Year| (|).}*/}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Thesis type| |,} */}
                <Partials.CitationView className="citationThesisType" value={record.thesisType} suffix="," />

                {/* {School, Centre or Institute| |,} */}
                <Partials.CitationView className="citationOrgUnit" value={record.orgUnit} suffix="," />

                {/* {Institution| |.} */}
                <Partials.CitationView className="citationOrgName" value={record.orgName} />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} hideDoiLink={this.props.hideDoiLink} />
            </div>
        );
    }
}
