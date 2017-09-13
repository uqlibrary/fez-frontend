import React from 'react';
import PropTypes from 'prop-types';

const AuthorsCitationView = ({publication}) => {
    const authorsCount = publication.fez_record_search_key_author ? publication.fez_record_search_key_author.length : 0;
    if (authorsCount === 0) return (<span className="citationAuthors empty" />);
    return (
        <span className="citationAuthors">
            {
                publication.fez_record_search_key_author.map((author, index) => (
                    <span className="citationAuthor" key={index}>
                        {author.rek_author}
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
    publication: PropTypes.object.isRequired
};

export default AuthorsCitationView;
