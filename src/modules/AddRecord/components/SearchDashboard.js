import React from 'react';
import { PropTypes } from 'prop-types';
// import FontIcon from 'material-ui/FontIcon';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';

import './_SearchDashboard.scss';

const SearchDashboard = ({loadingPublicationSources, mobile}) => {
    return (
      <div>
          {!mobile && (
            <div className="searchDashboardDesktop">
                <h3 className="title is-5">eSpace search</h3>
                <div className="body-2">eSPACE <span
                  className="is-pulled-right">{loadingPublicationSources && loadingPublicationSources.espace ? 'INACTIVE' : 'INACTIVE'} </span>
                </div><br />
                <h3 className="title is-5">External search</h3>
                <div className="body-2">
                    <div>WOS <span
                      className="is-pulled-right">{loadingPublicationSources && loadingPublicationSources.wos ? loadingPublicationSources.wosCount + ' records' :
                      <CircularProgress size={12} thickness={2}/>} </span></div>
                    <div>SCOPUS <span
                      className="is-pulled-right">{loadingPublicationSources && loadingPublicationSources.scopus ? loadingPublicationSources.scopusCount + ' records' :
                      <CircularProgress size={12} thickness={2}/>} </span></div>
                    <div>PUBMED <span
                      className="is-pulled-right">{loadingPublicationSources && loadingPublicationSources.pubmed ? loadingPublicationSources.pubmedCount + ' records' :
                      <CircularProgress size={12} thickness={2}/>} </span></div>
                    <div>CROSSREF <span
                      className="is-pulled-right">{loadingPublicationSources && loadingPublicationSources.crossref ? loadingPublicationSources.crossrefCount + ' records' :
                      <CircularProgress size={12} thickness={2}/>} </span></div>
                </div>
            </div>
          )}
          {mobile && (
            <div>
                <LinearProgress className="mobileSearchBar" mode="determinate" value={loadingPublicationSources.totalSearchedCount / 4 * 100}/>
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
