import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import YearCitationView from './YearCitationView';
import CitationView from './CitationView';

export default class ResearchReportCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const researchReport = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            publisher: this.props.publication.fez_record_search_key_publisher ?
                this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            placeOfPublication: this.props.publication.fez_record_search_key_place_of_publication ?
                this.props.publication.fez_record_search_key_place_of_publication.rek_place_of_publication : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null,
            series: this.props.publication.fez_record_search_key_series ?
                this.props.publication.fez_record_search_key_series.rek_series : null
        };

        // eSpace citation view for ResearchReport
        // {Author}{Year| (|).}<i>{Title of report| |.}</i>{Series| |,}{Place of Publication| |:}{Publisher| |.} {doi| doi:|}
        return (
            <div className="citationContent citationResearchReport">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* authors list */}
                <AuthorsCitationView publication={this.props.publication} />

                {/* publication year */}
                <YearCitationView publication={this.props.publication} />.

                {/* research report title */}
                <CitationView citationClass="citationTitle">{researchReport.title}</CitationView>

                {/* series */}
                {
                    researchReport.series &&
                    <CitationView citationClass="citationSeries">{researchReport.series}</CitationView>
                }

                {/* place of publication */}
                {
                    researchReport.placeOfPublication &&
                    <CitationView citationClass="citationPlaceOfPublication" suffix=":">{researchReport.placeOfPublication}</CitationView>
                }

                {/* publisher */}
                {
                    researchReport.publisher &&
                    <CitationView citationClass="citationPublisher">{researchReport.publisher}</CitationView>
                }

                {/* doi */}
                {
                    researchReport.doi &&
                    <span className="citationDOI">
                        <CitationView citationClass="citationLabel" suffix=":">doi</CitationView>
                        <CitationView citationClass="citationValue" suffix="">{researchReport.doi}</CitationView>
                    </span>
                }
            </div>
        );
    }
}
