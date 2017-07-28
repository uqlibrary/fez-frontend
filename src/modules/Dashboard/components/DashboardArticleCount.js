import React from 'react';
// import PropTypes from 'prop-types';

class DashboardArticleCount extends React.Component {
    render() {
        return (
              <div className="articleCount is-centered">
                  <div className="noOfArticles">38</div>
                  <div className="articlesFrom">eSpace articles from</div>
                  <div className="dateRange">1990<span> to </span>2017</div>
              </div>
        );
    }
}

export default DashboardArticleCount;
