import React from 'react';
import PropTypes from 'prop-types';
import CitationView from './CitationView';
import {locale} from 'config';

export default class AuthorsCitationView extends React.Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        searchKey: PropTypes.object,
        className: PropTypes.string,
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        initialNumberOfAuthors: PropTypes.number,
        thresholdNumberOfAuthors: PropTypes.number,
    };

    static defaultProps = {
        suffix: ' ',
        searchKey: {
            key: 'fez_record_search_key_author',
            subkey: 'rek_author',
            order: 'rek_author_order'
        },
        className: 'citationAuthors',
        initialNumberOfAuthors: 10,
        thresholdNumberOfAuthors: 3
        // TODO: link to author: idSearchKey: {key: 'fez_record_search_key_author_id', subkey: 'rek_author_id'}
    };

    constructor(props) {
        super(props);

        const {publication, searchKey: {key, order, subkey}, initialNumberOfAuthors, thresholdNumberOfAuthors} = props;

        const publicationAuthors = publication && publication[key] && [...publication[key]];    // copy authors to separate variable so sorting doesn't change original record

        const authorsCount = publicationAuthors && Array.isArray(publicationAuthors)
            ? publicationAuthors.length : 0;

        this.state = {
            hasMoreAuthors: authorsCount > (initialNumberOfAuthors + thresholdNumberOfAuthors),
            toggleShowMoreLink: authorsCount > (initialNumberOfAuthors + thresholdNumberOfAuthors),
            authors: publicationAuthors && Array.isArray(publicationAuthors)
                ? publicationAuthors.sort((author1, author2) => (
                    author1[order] - author2[order])
                ).map(author => (
                    {
                        // TODO: add author id for linking
                        value: author[subkey],
                        order: author[order]
                    }
                ))
                : []
        };
    }

    renderAuthors = (authors) => {
        return authors.map((author, index) => {
            const prefix = authors.length >= 2 && index === authors.length - 1 ? ' and ' : '';
            const suffix = authors.length > 2 && index < authors.length - 1 ? ', ' : '';

            return (
                <CitationView
                    className="citationAuthor"
                    key={`citationAuthor_${index + 1}`}
                    value={author.value}
                    prefix={prefix}
                    suffix={suffix} />
            );
        });
    };

    _toggleShowMore = (e) => {
        e.preventDefault();
        this.setState({
            toggleShowMoreLink: !this.state.toggleShowMoreLink
        });
    };

    render() {
        const {showMoreLabel, showLessLabel} = locale.components.publicationCitation.citationAuthors;
        const {className, prefix, suffix, initialNumberOfAuthors} = this.props;
        const {authors, hasMoreAuthors, toggleShowMoreLink} = this.state;

        if (authors.length === 0) return (<span className={`${className || ''} empty`} />);

        return (
            <span className={className || ''}>
                {prefix}
                {
                    this.renderAuthors(authors)
                        .slice(0, hasMoreAuthors && toggleShowMoreLink
                            ? initialNumberOfAuthors
                            : authors.length)
                }
                {
                    hasMoreAuthors &&
                    <span>
                        &nbsp;
                        <a href="#"
                            className="citationShowMoreAuthors"
                            onClick={this._toggleShowMore}
                            onKeyPress={this._toggleShowMore}>
                            {
                                toggleShowMoreLink
                                    ? showMoreLabel.replace('[numberOfAuthors]', `${authors.length - initialNumberOfAuthors}`)
                                    : showLessLabel
                            }
                        </a>
                    </span>
                }
                {suffix}
            </span>
        );
    }
}
