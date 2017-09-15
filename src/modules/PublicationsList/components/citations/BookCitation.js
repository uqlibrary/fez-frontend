import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import EditorsCitationView from './EditorsCitationView';
import YearCitationView from './YearCitationView';

export default class BookCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const book = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            edition: this.props.publication.fez_record_search_key_edition ?
                this.props.publication.fez_record_search_key_edition.rek_edition : null,
            placeOfPublication: this.props.publication.fez_record_search_key_place_of_publication ?
                this.props.publication.fez_record_search_key_place_of_publication.rek_place_of_publication : null,
            publisher: this.props.publication.fez_record_search_key_publisher ?
                this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null
        };

        // eSpace citation view for Book
        // {6034} <i>{10612}</i>{12115|| ed}. {6042|Edited by |} {6113|(| ed.)} {6116||:} {6114}, {6044}.{16522| doi:|} - Legacy Fez
        // Author <i>Title</i> Edition ed. Edited by Editor Place of Publication: Publisher, Publ. doi: DOI

        // Citation Styles - Book: https://docs.google.com/document/d/1j0ol7sW39dDg3X3bSV6Tg0a2MEwGtDodwYmv9m0bcHQ/
        // {6034} ({6044}). <i>{10612}</i>. {6116||}, {6114}. {16522| doi:|}
        // Author (Year). Title|. Place of Publication|, Publisher|. doi: doi
        return (
            <div className="citationContent citationBookChapter">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* authors list */}
                <AuthorsCitationView publication={this.props.publication} />
                {/* book title */}
                {
                    book.title &&
                    <span className="citationJournalName"> {book.title}</span>
                }
                {/* book edition */}
                {
                    book.edition &&
                    <span className="citationJournalName">, {book.edition} ed. </span>
                }
                {/* editors list */}
                <EditorsCitationView publication={this.props.publication} />
                {/* place of publication */}
                {
                    book.placeOfPublication &&
                    <span className="citationPlaceOfPublication"> {book.placeOfPublication}:</span>
                }
                {/* publisher */}
                {
                    book.publisher &&
                    <span className="citationPublisher"> {book.publisher}, </span>
                }
                {/* publication year */}
                <YearCitationView publication={this.props.publication} />.
                {/* doi */}
                {
                    book.doi &&
                    <span className="citationDOI">
                        <span className="citationLabel"> doi: </span>
                        <span className="citationValue"> {book.doi} </span>
                    </span>
                }
            </div>
        );
    }
}
