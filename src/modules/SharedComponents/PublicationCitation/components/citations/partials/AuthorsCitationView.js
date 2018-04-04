import React from 'react';
import PropTypes from 'prop-types';
import CitationView from './CitationView';
import {locale} from 'locale';
import {pathConfig} from 'config/routes';

export default class AuthorsCitationView extends React.Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        searchKey: PropTypes.object,
        idSearchKey: PropTypes.object,
        className: PropTypes.string,
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        initialNumberOfAuthors: PropTypes.number,
        thresholdNumberOfAuthors: PropTypes.number,
        showLink: PropTypes.bool
    };

    static defaultProps = {
        suffix: ' ',
        searchKey: {
            key: 'fez_record_search_key_author',
            subkey: 'rek_author',
            order: 'rek_author_order'
        },
        idSearchKey: {
            idKey: 'fez_record_search_key_author_id',
            idSubkey: 'rek_author_id',
            idOrder: 'rek_author_id_order'
        },
        className: 'citationAuthors',
        initialNumberOfAuthors: 10,
        thresholdNumberOfAuthors: 3,
        showLink: false
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
                        id: this.getAuthorId(author[order]),
                        value: author[subkey],
                        order: author[order]
                    }
                ))
                : []
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state
            || JSON.stringify(nextProps.publication[nextProps.searchKey]) !== JSON.stringify(this.props.publication[this.props.searchKey]);
    }

    getAuthorId = (order) => {
        let id = 0;
        const {publication, idSearchKey: {idKey, idOrder, idSubkey}, showLink} = this.props;

        if (showLink) {
            const authorIds = publication && publication[idKey] && [...publication[idKey]];
            for (const authorId of authorIds) {
                if (authorId[idOrder] === order) {
                    id = authorId[idSubkey];
                    break;
                }
            }
        }

        return id;
    }

    renderAuthors = (authors, showLink) => {
        return authors.map((author, index) => {
            const prefix = authors.length > 1 && index === authors.length - 1 ? (showLink && ', ' || ' and ') : ' ';
            const suffix = authors.length > 2 && index < authors.length - 1 ? ', ' : '';
            const key = `citationAuthor_${index + 1}`;
            const element = (
                <CitationView
                    className="citationAuthor"
                    key={key}
                    value={author.value}
                    prefix={prefix}
                    suffix={suffix} />
            );

            if (showLink) {
                const href = author.id ? pathConfig.list.authorId(author.id) : pathConfig.list.author(author.value);
                const className = author.id ? 'authorIdLink' : 'authorNameLink';
                return <a className={className} href={href} key={key}>{element}</a>;
            } else {
                return element;
            }
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
        const {className, prefix, suffix, initialNumberOfAuthors, showLink} = this.props;
        const {authors, hasMoreAuthors, toggleShowMoreLink} = this.state;

        if (authors.length === 0) return (<span className={`${className || ''} empty`} />);

        return (
            <span className={className || ''}>
                {prefix}
                {
                    this.renderAuthors(authors, showLink)
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
