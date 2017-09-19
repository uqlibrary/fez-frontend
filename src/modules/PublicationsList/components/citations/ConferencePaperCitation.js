import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import EditorsCitationView from './EditorsCitationView';
import YearCitationView from './YearCitationView';
import PageRangeCitationView from './PageRangeCitationView';

export default class BookCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const conferencePaper = {
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

        // eSpace citation view for Book
        // {4191} ({4041}). {10605}. In: {4194||, }{9622||.} <i>{11061}</i>, {4172}, ({4189||}{4190|-|}). {4174}.{16516| doi:|} - Legacy Fez
        // Author (Year). Title of paper. In: Editor, Proceedings title. Conference name, Conference location, (Start page-End page). Conference dates. doi:DOI

        // TODO: Citation Styles - Book: https://docs.google.com/document/d/1j0ol7sW39dDg3X3bSV6Tg0a2MEwGtDodwYmv9m0bcHQ/
        // {4191} ({4041}). {10605}. {11061||}, {4172}, {????} {16522| doi:|}
        // Author (Year of Conference). Title|. Conference Name|, Conference Location|, Publisher|  doi: doi
        return (
            <div className="citationContent citationConferencePaper">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* authors list */}
                <AuthorsCitationView publication={this.props.publication} />
                {/* publication year */}
                <YearCitationView publication={this.props.publication} />.
                {/* conferencePaper title */}
                {
                    conferencePaper.title &&
                    <span className="citationTitle"> {conferencePaper.title}.</span>
                }
                {/*  In: Editor, Proceedings title. */}
                <EditorsCitationView publication={this.props.publication} />
                {/* conferencePaper title */}
                {
                    conferencePaper.name &&
                    <span className="citationConferencePaperName"> {conferencePaper.name},</span>
                }
                {/* conferencePaper location */}
                {
                    conferencePaper.location &&
                    <span className="citationConferencePaperLocation"> {conferencePaper.location}, </span>
                }
                {/* pages (start page-end page) */}
                <PageRangeCitationView publication={this.props.publication} />
                {/* conference dates */}
                {
                    conferencePaper.dates &&
                    <span> {conferencePaper.dates}.</span>
                }
                {/* doi */}
                {
                    conferencePaper.doi &&
                    <span className="citationDOI">
                        <span className="citationLabel"> doi: </span>
                        <span className="citationValue"> {conferencePaper.doi} </span>
                    </span>
                }
            </div>
        );
    }
}
