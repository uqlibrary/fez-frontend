import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CitationView from './CitationView';
import { locale } from 'locale';
import { pathConfig } from 'config/pathConfig';
import { Link } from 'react-router-dom';
import { withTheme } from 'helpers/withTheme';

const classes = {
    authorIdLink: theme => ({
        color: theme.palette.success.main,
    }),
};

export class AuthorsCitationView extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        searchKey: PropTypes.object,
        idSearchKey: PropTypes.object,
        className: PropTypes.string,
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        separator: PropTypes.string,
        showLink: PropTypes.bool,
        getLink: PropTypes.func,
        maxAuthorDisplayNumber: PropTypes.number,
        citationStyle: PropTypes.string,
        theme: PropTypes.any,
    };

    static defaultProps = {
        suffix: ' ',
        separator: ', ',
        searchKey: {
            key: 'fez_record_search_key_author',
            subkey: 'rek_author',
            order: 'rek_author_order',
            totalCountKey: 'fez_record_search_key_author_id',
        },
        idSearchKey: {
            idKey: 'fez_record_search_key_author_id',
            idSubkey: 'rek_author_id',
            idOrder: 'rek_author_id_order',
        },
        className: 'citationAuthors',
        showLink: false,
        getLink: pathConfig.list.author,
    };

    constructor(props) {
        super(props);

        const {
            publication,
            searchKey: { key, totalCountKey, order, subkey },
        } = props;

        // copy authors to separate variable so sorting doesn't change original record
        const publicationAuthors = publication && publication[key] && [...publication[key]];
        this.state = {
            authorsTotal:
                publication &&
                (publication?.[totalCountKey] ?? publication[key]) &&
                (publication?.[totalCountKey]?.length ?? publication[key].length),
            authors:
                publicationAuthors && Array.isArray(publicationAuthors)
                    ? publicationAuthors.map(author => ({
                          id: this.getAuthorId(author[order]),
                          value: author[subkey],
                          order: author[order],
                      }))
                    : [],
        };
    }

    getAuthorId = order => {
        let id = 0;
        const {
            publication,
            idSearchKey: { idKey, idOrder, idSubkey },
            showLink,
        } = this.props;

        if (showLink) {
            const authorIds = publication && publication[idKey] && [...publication[idKey]];
            if (!!authorIds) {
                for (const authorId of authorIds) {
                    if (authorId[idOrder] === order) {
                        id = authorId[idSubkey];
                        break;
                    }
                }
            }
        }

        return id;
    };

    renderAuthors = (
        theme,
        authors,
        separator,
        showLink,
        getLink,
        maxAuthorDisplayNumber,
        citationStyle,
        authorsTotal,
    ) => {
        let authorsList = authors;
        if (citationStyle === 'header' || citationStyle === 'list') {
            authorsList = authorsList.slice(0, maxAuthorDisplayNumber);
        }
        if (citationStyle === 'header' && authors.length > maxAuthorDisplayNumber) {
            authorsList.push(authors[authors.length - 1]);
        }
        const numAuthorsMore = authorsTotal - authorsList.length;

        return authorsList.map((author, index) => {
            const isLastAuthor = index === authorsList.length - 1;
            const hasMultipleAuthors = authorsList.length > 1;

            // prefix to each author
            let prefix = '';
            if (isLastAuthor && hasMultipleAuthors) {
                if (citationStyle === 'header') {
                    if (authorsList.length < authorsTotal) {
                        prefix = ' ... ';
                    } else {
                        prefix = ' and ';
                    }
                } else if (authorsTotal === authorsList.length && index !== 0) {
                    prefix = ' and ';
                }
            }

            let suffix = '';
            if (citationStyle === 'list' && isLastAuthor && authorsList.length > 2 && numAuthorsMore > 0) {
                suffix = ` and ${numAuthorsMore} more`;
            } else if (authorsList.length > 2 && index < authorsList.length - 1) {
                suffix = separator;
            }

            const key = `citationAuthor_${index + 1}`;
            const testId = this.props.searchKey.subkey.replace(/_/g, '-');
            let element = (
                <CitationView
                    className="citationAuthor"
                    key={key}
                    citationId={`${testId}-${index}`}
                    value={author.value}
                    prefix=""
                    suffix=""
                />
            );

            if (showLink) {
                const href = getLink(author.value, author.id);
                element = (
                    <Link
                        style={{ ...(!!author.id ? classes.authorIdLink(theme) : {}) }}
                        className={!!!author.id ? 'authorNameLink' : ''}
                        to={href}
                        key={key}
                        data-testid={`${testId}-${index}-link`}
                    >
                        {element}
                    </Link>
                );
            }
            return (
                <React.Fragment key={key}>
                    {prefix}
                    {element}
                    {suffix}
                </React.Fragment>
            );
        });
    };

    render() {
        const maxAuthorDisplayNumber = !!this.props.maxAuthorDisplayNumber
            ? this.props.maxAuthorDisplayNumber
            : locale.components.publicationCitation.citationAuthors.maxAuthorDisplayNumber;
        const { theme, className, prefix, suffix, separator, showLink, getLink, citationStyle } = this.props;
        const { authors, authorsTotal } = this.state;

        if (authors.length === 0) return <span className={`${className || ''} empty`} />;

        return (
            <span className={className || ''}>
                {prefix}
                {this.renderAuthors(
                    theme,
                    authors,
                    separator,
                    showLink,
                    getLink,
                    maxAuthorDisplayNumber,
                    citationStyle,
                    authorsTotal,
                )}
                {suffix}
            </span>
        );
    }
}

export default withTheme()(AuthorsCitationView);
