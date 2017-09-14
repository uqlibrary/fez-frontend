import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import YearCitationView from './YearCitationView';

export default class BookChapterCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const bookChapter = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            bookTitle: this.props.publication.fez_record_search_key_book_title ?
                this.props.publication.fez_record_search_key_book_title.rek_book_title : null,
            edition: this.props.publication.fez_record_search_key_edition ?
                this.props.publication.fez_record_search_key_edition.rek_edition : null,
            startPage: this.props.publication.fez_record_search_key_start_page ?
                this.props.publication.fez_record_search_key_start_page.rek_start_page : null,
            endPage: this.props.publication.fez_record_search_key_end_page ?
                this.props.publication.fez_record_search_key_end_page.rek_end_page : null,
            placeOfPublication: this.props.publication.fez_record_search_key_place_of_publication ?
                this.props.publication.fez_record_search_key_place_of_publication.rek_place_of_publication : null,
            publisher: this.props.publication.fez_record_search_key_publisher ?
                this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null
        };

        // eSpace citation view for Book Chapter
        // {6230} ({6260}). {10623}. In {6238|| (Ed.),} <i>{10630}</i> {6261|| ed.} ({6265|pp. }{6266|-})  {6258}: {6259}.{16518| doi:|}
        // authors (year). title. In editors (Ed.), <i>book title</i> edition ed. (pp. start page-end page) place of publication: publisher. doi: DOI
        return (
            <div className="citationContent citationBookChapter">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* authors list */}
                <AuthorsCitationView publication={this.props.publication} />

                {/* publication year */}
                <YearCitationView publication={this.props.publication} />.

                {/* chapter title */}
                <span className="citationTitle"> {bookChapter.title}. </span>
                {/* editors list */}
                In <AuthorsCitationView
                    publication={this.props.publication}
                    searchKey={{key: 'fez_record_search_key_contributor', subkey: 'rek_contributor', order: 'rek_contributor_order'}}/> (Ed.),
                {/* book title */}
                {
                    bookChapter.bookTitle &&
                    <span className="citationJournalName"> {bookChapter.bookTitle},</span>
                }
                {/* book edition */}
                {
                    bookChapter.edition &&
                    <span className="citationJournalName"> {bookChapter.edition} ed.</span>
                }
                {/* pages (pp. start page-end page) */}
                {
                    (bookChapter.startPage || bookChapter.endPage) ? ' (pp. ' : ''
                }
                {
                    bookChapter.startPage &&
                    <span className="citationStartPage">
                        {bookChapter.startPage}{bookChapter.endPage ? '-' : '' }
                    </span>
                }
                {
                    bookChapter.endPage &&
                    <span className="citationEndPage">{bookChapter.endPage}</span>
                }
                {
                    (bookChapter.startPage || bookChapter.endPage) ? ') ' : ''
                }
                {/* place of publication */}
                {
                    bookChapter.placeOfPublication &&
                    <span className="citationPlaceOfPublication"> {bookChapter.placeOfPublication}:</span>
                }
                {/* publisher */}
                {
                    bookChapter.publisher &&
                    <span className="citationPublisher"> {bookChapter.publisher}</span>
                }
                .
                {/* doi */}
                {
                    bookChapter.doi &&
                    <span className="citationDOI">
                        <span className="citationLabel"> doi: </span>
                        <span className="citationValue"> {bookChapter.doi} </span>
                    </span>
                }
            </div>
        );
    }
}
