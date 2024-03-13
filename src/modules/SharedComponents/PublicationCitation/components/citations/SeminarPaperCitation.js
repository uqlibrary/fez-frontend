import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class SeminarPaperCitation extends Component {
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
            series: this.props.publication.fez_record_search_key_series
                ? this.props.publication.fez_record_search_key_series.rek_series
                : null,
            orgUnit: this.props.publication.fez_record_search_key_org_unit_name
                ? this.props.publication.fez_record_search_key_org_unit_name.rek_org_unit_name
                : null,
            orgName: this.props.publication.fez_record_search_key_org_name
                ? this.props.publication.fez_record_search_key_org_name.rek_org_name
                : null,
        };

        // eSpace citation view for Seminar Paper
        // {Author}{Year| (|).}<i>{Title| |.}</i>{Seminar series| |.}{School, Centre or Institute| |,}{Institution| |.}
        return (
            <div className="citationContent citationSeminarPaper">
                {/* {Author}*/}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Publication Year| (|).} */}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Seminar series| |.} */}
                <Partials.CitationView className="citationSeries" value={record.series} />

                {/* {School, Centre or Institute| |,}  - fez_record_search_key_org_unit_name.rek_org_unit_name */}
                <Partials.CitationView className="citationOrgUnit" value={record.orgUnit} suffix="," />

                {/* {Institution| |.} - fez_record_search_key_org_name.rek_org_name */}
                <Partials.CitationView className="citationOrgName" value={record.orgName} />
            </div>
        );
    }
}
