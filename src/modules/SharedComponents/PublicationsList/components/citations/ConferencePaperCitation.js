import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import * as Partials from './partials';

export default class ConferencePaperCitation extends Component {
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
            name: this.props.publication.fez_record_search_key_conference_name ?
                this.props.publication.fez_record_search_key_conference_name.rek_conference_name : null,
            location: this.props.publication.fez_record_search_key_conference_location ?
                this.props.publication.fez_record_search_key_conference_location.rek_conference_location : null,
            dates: this.props.publication.fez_record_search_key_conference_dates ?
                this.props.publication.fez_record_search_key_conference_dates.rek_conference_dates : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null
        };

        // eSpace citation view for conference paper
        // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Conference Name| |,}{Conference Location| |,}{Conference Date| |.}{Place of Publication| |:}{Publisher| |.} {doi| doi:||}
        return (
            <div className="citationContent citationConferencePaper">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* authors list */}
                <Partials.AuthorsCitationView publication={this.props.publication} />
                {/* publication year */}
                <Partials.YearCitationView publication={this.props.publication} />.
                {/* conferencePaper title */}
                {
                    record.title &&
                    <span className="citationTitle"> {record.title}.</span>
                }
                {/*  In: Editor, Proceedings title. */}
                <Partials.EditorsCitationView publication={this.props.publication} />
                {/* conferencePaper title */}
                {
                    record.name &&
                    <span className="citationConferencePaperName"> {record.name},</span>
                }
                {/* conferencePaper location */}
                {
                    record.location &&
                    <span className="citationConferencePaperLocation"> {record.location}, </span>
                }
                {/* pages (start page-end page) */}
                <Partials.PageRangeCitationView publication={this.props.publication} />
                {/* conference dates */}
                {
                    record.dates &&
                    <span className="citationConferencePaperConferenceDates"> {record.dates}.</span>
                }
                {/* doi */}
                {
                    record.doi &&
                    <span className="citationDOI">
                        <span className="citationLabel"> doi: </span>
                        <span className="citationValue"> {record.doi} </span>
                    </span>
                }
            </div>
        );
    }
}
