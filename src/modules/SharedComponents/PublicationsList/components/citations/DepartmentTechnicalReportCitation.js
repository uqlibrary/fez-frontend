import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import * as Partials from './partials';

export default class DepartmentTechnicalReportCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const record = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            series: this.props.publication.fez_record_search_key_series ?
                this.props.publication.fez_record_search_key_series.rek_series : null,
            reportNumber: this.props.publication.fez_record_search_key_report_number ?
                this.props.publication.fez_record_search_key_report_number.rek_report_number : null,
            placeOfPublication: this.props.publication.fez_record_search_key_place_of_publication ?
                this.props.publication.fez_record_search_key_place_of_publication.rek_place_of_publication : null,
            publisher: this.props.publication.fez_record_search_key_publisher ?
                this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null
        };

        // eSpace citation view for Department Technical Report
        // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Series Title| |,} {Report Number| |.}{Place of Publication| |:}{Publisher| |.} {doi| doi:|}

        return (
            <div className="citationContent citationDepartmentTechnicalReport">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* {Author}*/}
                <Partials.AuthorsCitationView publication={this.props.publication} />

                {/* {Year| (|).}*/}
                <Partials.YearCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationView className="citationTitle" value={record.title} />

                {/* {Series Title| |,} */}
                <Partials.CitationView className="citationSeries" value={record.series} suffix="," />

                {/* {Report Number| |.} */}
                <Partials.CitationView className="citationReportNumber" value={record.reportNumber} />

                {/* {Place of Publication| |:} */}
                <Partials.CitationView className="citationPlaceOfPublication" value={record.placeOfPublication} suffix=":"/>

                {/* {Publisher| |.} */}
                <Partials.CitationView className="citationPublisher" value={record.publisher} />
                .
                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
