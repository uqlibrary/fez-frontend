import React from 'react';
import PropTypes from 'prop-types';

const AuthorsCitationView = ({publication, searchKey, className, prefix, suffix}) => {
    const authorsCount = Array.isArray(publication[searchKey.key]) ? publication[searchKey.key].length : 0;
    if (authorsCount === 0) return (<span className="${className} empty" />);

    return (
        <span className={className}>
            {prefix}
            {
                Array.isArray(publication[searchKey.key]) && publication[searchKey.key]
                    .sort((author1, author2) => (
                        author1[searchKey.order] > author2[searchKey.order])
                    ).map((author, index) => (
                        <span className="citationAuthor" key={index}>
                            {author[searchKey.subkey]}
                            {
                                index === authorsCount - 1
                                    ? ' '
                                    : (`${index < authorsCount - 2 ? ', ' : ' and '}`)
                            }
                        </span>
                    ))
            }
            {suffix}
        </span>
    );
};

AuthorsCitationView.propTypes = {
    publication: PropTypes.object.isRequired,
    searchKey: PropTypes.object,
    className: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string
};

AuthorsCitationView.defaultProps = {
    searchKey: { key: 'fez_record_search_key_author', subkey: 'rek_author', order: 'rek_author_order' },
    className: 'citationAuthors'
    // TODO: link to author: idSearchKey: {key: 'fez_record_search_key_author_id', subkey: 'rek_author_id'}
};

export default AuthorsCitationView;
