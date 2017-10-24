import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import YearCitationView from './YearCitationView';

export default class audioDocumentCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const audioDocument = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            publishedDate: this.props.publication.rek_date, // null,
            publisher: this.props.publication.fez_record_search_key_publisher ? this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            series: this.props.publication.fez_record_search_key_series ? this.props.publication.fez_record_search_key_series.rek_series : null,
            doi: this.props.publication.fez_record_search_key_doi ? this.props.publication.fez_record_search_key_doi.rek_doi : null
        };

        // eSpace citation view for Audio Document
        // {9514} {9531|(|)} {9543}. {11028}{9540| :|.} {9616|(|)}
        // OLD: Creator (Publ) Title. :<span class="citation_publisher">Publisher</span>. (<span class="citation_series">Series</span>)
        // {Creator}{Publication Year| (|).}{Title| |.}{Publisher| |.}{Series| |.}{doi| doi:|}

        return (
            <div className="citationContent citationaudioDocument">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                <AuthorsCitationView publication={this.props.publication} />
                <YearCitationView publication={this.props.publication} />.
                {
                    audioDocument.title &&
                    <span className="citationTitle"> {audioDocument.title}.</span>
                }
                {
                    audioDocument.publisher &&
                    <span className="citationPublisher"> {audioDocument.publisher}.</span>
                }
                {
                    audioDocument.series &&
                    <span className="citationSeries"> {audioDocument.series}.</span>
                }
                {
                    audioDocument.doi &&
                    <span className="citationDOI">
                        <span className="citationLabel"> doi: </span>
                        <span className="citationValue"> {audioDocument.doi}</span>
                    </span>
                }
            </div>
        );
    }
}
