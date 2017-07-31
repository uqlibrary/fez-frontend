import React from 'react';
import PropTypes from 'prop-types';

const DashboardArticleCount = ({account}) => {
    const articleCount = account.get('espace').get('doc_count');
    const articleFirstYear = account.get('espace').get('first_year');
    const articleLastYear = account.get('espace').get('last_year');

    return (
        <div className="articleCount is-centered">
            {articleCount && (
                <div>
                    <div className="noOfArticles">{articleCount}</div>
                    <div className="articlesFrom">eSpace articles from</div>
                    <div className="dateRange">{articleFirstYear}<span> to </span>{articleLastYear}</div>
                </div>
            )}
        </div>
    );
};

DashboardArticleCount.propTypes = {
    account: PropTypes.object.isRequired,
};

export default DashboardArticleCount;
