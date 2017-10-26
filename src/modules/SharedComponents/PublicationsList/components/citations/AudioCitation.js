import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import YearCitationView from './YearCitationView';

export default class AudioCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const audio = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            publisher: this.props.publication.fez_record_search_key_publisher ?
                this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null,
            series: this.props.publication.fez_record_search_key_series ?
                this.props.publication.fez_record_search_key_series.rek_series : null
        };

        // eSpace citation view for Audio
        // {Creator}{Publication Year| (|).} <i>{Title| |.}</i> {Publisher| |.}{Series| |.} {doi| doi:|}

        return (
            <div className="citationContent citationAudio">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* authors list */}
                <AuthorsCitationView publication={this.props.publication} />

                {/* publication year */}
                <YearCitationView publication={this.props.publication} />.

                {/* audio title */}
                <span className="citationTitle"> {audio.title}.</span>

                {/* publisher */}
                {
                    audio.publisher &&
                    <span className="citationPublisher"> {audio.publisher}.</span>
                }

                {/* series */}
                {
                    audio.series &&
                    <span className="citationSeries"> {audio.series}.</span>
                }

                {/* doi */}
                {
                    audio.doi &&
                    <span className="citationDOI">
                        <span className="citationLabel"> doi: </span>
                        <span className="citationValue"> {audio.doi}</span>
                    </span>
                }
            </div>
        );
    }
}
