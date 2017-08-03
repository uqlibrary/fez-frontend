import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';

const DashboardArticleCount = ({articleCount, articleFirstYear, articleLastYear}) => {
    const txt = locale.components.dashboardArticleCount;
    return (
        <div className="authorCounter is-centered">
            {articleCount && articleFirstYear && articleLastYear && (
                <div>
                <div className="noOfArticles">{articleCount}</div>
                <div className="articlesFrom">{txt.countTitle}</div>
                <div className="dateRange">{articleFirstYear}<span>{txt.yearSeparator}</span>{articleLastYear}</div>
                </div>
            )}
        </div>
    );
};

DashboardArticleCount.propTypes = {
    articleCount: PropTypes.any,
    articleFirstYear: PropTypes.any,
    articleLastYear: PropTypes.any,
};

export default DashboardArticleCount;
