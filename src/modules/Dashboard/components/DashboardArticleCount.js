import React from 'react';
import PropTypes from 'prop-types';

const DashboardArticleCount = ({articleCount, articleFirstYear, articleLastYear}) => {
    return (
        <div className="authorCounter is-centered">
            <div className="noOfArticles">{articleCount}</div>
            <div className="articlesFrom">eSpace articles from</div>
            <div className="dateRange">{articleFirstYear}<span> to </span>{articleLastYear}</div>
        </div>
    );
};

DashboardArticleCount.propTypes = {
    articleCount: PropTypes.string,
    articleFirstYear: PropTypes.number,
    articleLastYear: PropTypes.number,
};

export default DashboardArticleCount;
