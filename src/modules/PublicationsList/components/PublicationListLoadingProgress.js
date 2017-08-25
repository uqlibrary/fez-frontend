import React from 'react';
import {PropTypes} from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import {locale} from 'config';

const PublicationListLoadingProgress = ({loadingPublicationSources, mobile}) => {
    const txt = locale.pages.addRecord.step2.searchResults.searchDashboard;

    return (
        <div>
            {
                !mobile &&
                <div className="searchDashboardDesktop">
                    <h3 className="title is-5">{txt.title}</h3>
                    <div className="body-2">
                        {txt.repositories.map((item, index) => (
                            <div key={index} className="searchDashboardList">
                                {item.title}
                                <span className="is-pulled-right">
                                    {
                                        loadingPublicationSources && loadingPublicationSources[item.id] ?
                                            (
                                                <div>{loadingPublicationSources[`${item.id}Count`]} {txt.recordSuffix}</div>
                                            ) : (
                                                <CircularProgress
                                                    size={14}
                                                    thickness={2}
                                                    aria-label={`${item.title} ${txt.ariaCircularProgressLabelSuffix}`} />
                                            )
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {
                mobile &&
                <div className="searchDashboardMobile">
                    <LinearProgress
                        className="searchDashboardBar"
                        mode="determinate"
                        value={loadingPublicationSources.totalSearchedCount / loadingPublicationSources.totalSourcesCount * 100}
                        aria-valuenow={loadingPublicationSources.totalSearchedCount / loadingPublicationSources.totalSourcesCount * 100}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>
            }
        </div>
    );
};

PublicationListLoadingProgress.propTypes = {
    loadingPublicationSources: PropTypes.object.isRequired,
    mobile: PropTypes.bool
};

export default PublicationListLoadingProgress;
