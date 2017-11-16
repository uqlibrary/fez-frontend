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

        const authorsCount = props.publication[props.searchKey.key] && Array.isArray(props.publication[props.searchKey.key])
            ? props.publication[props.searchKey.key].length : 0;

        this.state = {
            hasMoreAuthors: authorsCount > (props.initialNumberOfAuthors + props.thresholdNumberOfAuthors),
            toggleShowMoreLink: authorsCount > (props.initialNumberOfAuthors + props.thresholdNumberOfAuthors),
            authors: props.publication[props.searchKey.key] && Array.isArray(props.publication[props.searchKey.key])
                ? props.publication[props.searchKey.key].sort((author1, author2) => (
                    author1[props.searchKey.order] - author2[props.searchKey.order])
                ).map(author => (
                    {
                        // TODO: add author id for linking
                        value: author[props.searchKey.subkey],
                        order: author[props.searchKey.order]
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
    }

    _toggleShowMore = (e) => {
        e.preventDefault();
        this.setState({
            toggleShowMoreLink: !this.state.toggleShowMoreLink
        });
    };

    render() {
        const {showMoreLabel, showLessLabel} = locale.components.publicationCitation.citationAuthors;
        if (this.state.authors.length === 0) return (<span className={`${this.props.className || ''} empty`} />);
        return (
            <span className={this.props.className || ''}>
                {this.props.prefix}
                {
                    this.renderAuthors(this.state.authors)
                        .slice(0, this.state.hasMoreAuthors && this.state.toggleShowMoreLink
                            ? this.props.initialNumberOfAuthors
                            : this.state.authors.length)
                }
                {
                    this.state.hasMoreAuthors &&
                    <span>
                        &nbsp;
                        <a href="#"
                            className="citationShowMoreAuthors"
                            onClick={this._toggleShowMore}
                            onKeyPress={this._toggleShowMore}>
                            {
                                this.state.toggleShowMoreLink
                                    ? showMoreLabel.replace('[numberOfAuthors]', this.state.authors.length - this.props.initialNumberOfAuthors)
                                    : showLessLabel
                            }
                        </a>
                    </span>
                }
                {this.props.suffix}
            </span>
        );
    }
}
