import React from 'react';
import { PropTypes } from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import { locale } from 'config';

import './_SearchDashboard.scss';

const SearchDashboard = ({loadingPublicationSources, mobile}) => {
    const txt = locale.components.searchDashboard;

    return (
      <div>
          {!mobile && (
            <div className="searchDashboardDesktop">
                <h3 className="title is-5">{txt.title}</h3>
                <div className="body-2">
                    {locale.components.searchDashboard.repositories.map((item, index) => (
                      <div key={index} className="searchDashboardList">
                          {item.title}
                          <span className="is-pulled-right">
                              {loadingPublicationSources && loadingPublicationSources[item.id] ? ( loadingPublicationSources[`${item.id}Count`] + ' record(s)')
                                : ( <CircularProgress size={14} thickness={2}/> )}
                          </span>
                      </div>
                    ))}
                </div>
            </div>
          )}
          {mobile && (
            <div className="searchDashboardMobile">
                <LinearProgress className="searchDashboardBar" mode="determinate"
                                value={loadingPublicationSources.totalSearchedCount / loadingPublicationSources.totalSourcesCount * 100}/>
            </div>
          )}
      </div>
    );
};

SearchDashboard.propTypes = {
    loadingPublicationSources: PropTypes.object.isRequired,
    mobile: PropTypes.bool
};

export default SearchDashboard;
