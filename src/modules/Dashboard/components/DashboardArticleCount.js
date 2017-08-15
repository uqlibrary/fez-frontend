import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';

const DashboardArticleCount = ({values}) => {
    const txt = locale.pages.dashboard.header.dashboardArticleCount;
    return (
        <div className="authorCounter is-centered">
            {values.articleCount && values.articleFirstYear && values.articleLastYear && (
                <div>
                <div className="noOfArticles">{values.articleCount}</div>
                <div className="articlesFrom">{txt.countTitle}</div>
                <div className="dateRange">{values.articleFirstYear}<span>{txt.yearSeparator}</span>{values.articleLastYear}</div>
                </div>
            )}
        </div>
    );
};

DashboardArticleCount.propTypes = {
    values: PropTypes.shape({
        articleCount: PropTypes.string,
        articleFirstYear: PropTypes.number,
        articleLastYear: PropTypes.number,
    })
};

export default DashboardArticleCount;
