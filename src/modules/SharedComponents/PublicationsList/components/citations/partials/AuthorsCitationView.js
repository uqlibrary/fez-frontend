import React from 'react';
import PropTypes from 'prop-types';
import CitationView from './CitationView';
import {locale} from 'config';

class AuthorsCitationView extends React.Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        searchKey: PropTypes.object,
        className: PropTypes.string,
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        initialNumberOfAuthors: PropTypes.number
    };

    static defaultProps = {
        searchKey: {
            key: 'fez_record_search_key_author',
            subkey: 'rek_author',
            order: 'rek_author_order'
        },
        className: 'citationAuthors',
        initialNumberOfAuthors: 10
        // TODO: link to author: idSearchKey: {key: 'fez_record_search_key_author_id', subkey: 'rek_author_id'}
    };

    constructor(props) {
        super(props);
        this.authorsCount = Array.isArray(props.publication[props.searchKey.key]) ? props.publication[props.searchKey.key].length : 0;
        this.state = {
            showMore: this.authorsCount < props.initialNumberOfAuthors,
            restAuthors: this.authorsCount - props.initialNumberOfAuthors
        };
        this.authors = [];
    }

    componentWillMount() {
        const {publication, searchKey} = this.props;
        const authors = Array.isArray(publication[searchKey.key]) && publication[searchKey.key]
            .sort((author1, author2) => (
                author1[searchKey.order] - author2[searchKey.order])
            );

        if (authors) this.authors = this.prepareAuthors(authors);
    }

    prepareAuthors = (authors) => {
        const {searchKey} = this.props;

        const firstAuthor = authors.slice(0, 1).shift();

        const lastAuthor = authors.length > 1 ? authors.slice(-1).shift() : false;

        const middleAuthors = authors.length > 2 ? authors.slice(1, authors.length - 1).map((author, index) => (
            <CitationView className="citationAuthor" key={index + 1} value={author[searchKey.subkey]} prefix=", " suffix=""/>
        )) : [];

        return [
            <CitationView className="citationAuthor" key={0} value={firstAuthor[searchKey.subkey]} prefix="" suffix={!lastAuthor ? ' ' : ''}/>,
            ...middleAuthors,
            lastAuthor ? <CitationView className="citationAuthor" key={authors.length} value={lastAuthor[searchKey.subkey]} prefix=" and " suffix=" "/> : '',
        ];
    };

    _toggleShowMore = (e) => {
        e.preventDefault();
        this.setState({showMore: !this.state.showMore});
    };

    renderShowMoreLink = (showMoreText) => (
        <a href="#" className="citationShowMoreAuthors" onClick={this._toggleShowMore} onKeyPress={this._toggleShowMore}> {showMoreText} </a>
    );

    render() {
        const {className, prefix, suffix, initialNumberOfAuthors} = this.props;
        const {showMore, showLess} = locale.components.publicationCitation.citationAuthors;
        if (this.authorsCount === 0) return (<span className={`${className || ''} empty`} />);

        return (
            <span className={className || ''}>
                {prefix}
                {
                    !this.state.showMore &&
                    this.authors.slice(0, initialNumberOfAuthors)
                }
                {
                    !this.state.showMore &&
                    this.renderShowMoreLink(showMore.replace('[numberOfAuthors]', this.state.restAuthors))
                }
                {
                    this.state.showMore &&
                    this.authors
                }
                {
                    this.authorsCount > initialNumberOfAuthors && this.state.showMore &&
                    this.renderShowMoreLink(showLess)
                }
                {suffix}
            </span>
        );
    }
}

export default AuthorsCitationView;
