import React from 'react';
import PropTypes from 'prop-types';

const AuthorsCitationView = ({publication, searchKey}) => {
    const authorsCount = publication[searchKey.key] ? publication[searchKey.key].length : 0;
    if (authorsCount === 0) return (<span className="citationAuthors empty" />);

    return (
        <span className="citationAuthors">
            {
                publication[searchKey.key]
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
        </span>
    );
};

AuthorsCitationView.propTypes = {
    publication: PropTypes.object.isRequired,
    searchKey: PropTypes.object
};

AuthorsCitationView.defaultProps = {
    searchKey: { key: 'fez_record_search_key_author', subkey: 'rek_author', order: 'rek_author_order' }
    // TODO: link to author: idSearchKey: {key: 'fez_record_search_key_author_id', subkey: 'rek_author_id'}
};

export default AuthorsCitationView;
