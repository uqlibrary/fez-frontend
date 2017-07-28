import React from 'react';
// import PropTypes from 'prop-types';

class DashboardArticleCount extends React.Component {
    render() {
        return (
          <div className="columns articleCount color-reverse">
              <div className="column is-centered">
                  <div className="noOfArticles">270</div>
                  <div className="articlesFrom">eSpace articles from</div>
                  <div className="dateRange">1990<span> to </span>2017</div>
              </div>
          </div>
        );
    }
}

export default DashboardArticleCount;
