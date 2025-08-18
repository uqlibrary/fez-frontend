import React from 'react';
import PropTypes from 'prop-types';
import CitationView from './CitationView';
import { locale } from 'locale';
import { pathConfig } from 'config/pathConfig';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const classes = {
    authorIdLink: theme => ({
        color: theme.palette.success.main,
    }),
};

export const AuthorsCitationView = ({
    publication,
    searchKey = {
        key: 'fez_record_search_key_author',
        subkey: 'rek_author',
        order: 'rek_author_order',
        totalCountKey: 'fez_record_search_key_author_id',
    },
    idSearchKey = {
        idKey: 'fez_record_search_key_author_id',
        idSubkey: 'rek_author_id',
        idOrder: 'rek_author_id_order',
    },
    className = 'citationAuthors',
    prefix,
    suffix = ' ',
    separator = ', ',
    showLink = false,
    getLink = pathConfig.list.author,
    maxAuthorDisplayNumber,
    citationStyle,
}) => {
    const { key, totalCountKey, order, subkey } = searchKey;
    const { idKey, idOrder, idSubkey } = idSearchKey;

    // copy authors to separate variable so sorting doesn't change original record
    const publicationAuthors = publication && publication[key] && [...publication[key]];
    const getAuthorId = order => {
        let id = 0;

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
    const theme = useTheme();
    const [state] = React.useState({
        authorsTotal:
            publication &&
            (publication?.[totalCountKey] ?? publication[key]) &&
            (publication?.[totalCountKey]?.length ?? publication[key].length),
        authors:
            publicationAuthors && Array.isArray(publicationAuthors)
                ? publicationAuthors.map(author => ({
                      id: getAuthorId(author[order]),
                      value: author[subkey],
                      order: author[order],
                  }))
                : [],
    });

    const renderAuthors = React.useCallback(() => {
        const _maxAuthorDisplayNumber = !!maxAuthorDisplayNumber
            ? maxAuthorDisplayNumber
            : locale.components.publicationCitation.citationAuthors.maxAuthorDisplayNumber;

        let authorsList = state.authors;
        if (citationStyle === 'header' || citationStyle === 'list') {
            authorsList = authorsList.slice(0, _maxAuthorDisplayNumber);
        }
        if (citationStyle === 'header' && state.authors.length > _maxAuthorDisplayNumber) {
            authorsList.push(state.authors[state.authors.length - 1]);
        }
        const numAuthorsMore = state.authorsTotal - authorsList.length;

        return authorsList.map((author, index) => {
            const isLastAuthor = index === authorsList.length - 1;
            const hasMultipleAuthors = authorsList.length > 1;

            // prefix to each author
            let prefix = '';
            if (isLastAuthor && hasMultipleAuthors) {
                if (citationStyle === 'header') {
                    if (authorsList.length < state.authorsTotal) {
                        prefix = ' ... ';
                    } else {
                        prefix = ' and ';
                    }
                } else if (state.authorsTotal === authorsList.length && index !== 0) {
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
            const testId = searchKey.subkey.replace(/_/g, '-');
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
    }, [
        maxAuthorDisplayNumber,
        state.authors,
        state.authorsTotal,
        citationStyle,
        searchKey.subkey,
        showLink,
        separator,
        getLink,
        theme,
    ]);

    if (state.authors.length === 0) return <span className={`${className || ''} empty`} />;

    return (
        <span className={className || ''}>
            {prefix}
            {renderAuthors(
                state.authors,
                separator,
                showLink,
                getLink,
                maxAuthorDisplayNumber,
                citationStyle,
                state.authorsTotal,
            )}
            {suffix}
        </span>
    );
};

AuthorsCitationView.propTypes = {
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
};

export default React.memo(AuthorsCitationView);
