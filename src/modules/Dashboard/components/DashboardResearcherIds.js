import React from 'react';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

const DashboardResearcherIds = ({values}) => {
    const badgeOK = (<FontIcon className="material-icons">done</FontIcon>);
    const badgeERROR = (<FontIcon className="material-icons">close</FontIcon>);
    const badgeStyle = {right: -5};
    return (
        <div className="columns researcherIds is-gapless">
            {values && Object.keys(values).map((item, index) => (
                    <div key={index} className={`${item} column is-narrow`}>
                        <a href="https://app.library.uq.edu.au/#/id" target="_blank">
                            <Badge
                                badgeStyle={badgeStyle}
                                className={values[item] ? (`${item.toLowerCase()} researchIdBadge ok`) : (`${item.toLowerCase()} researchIdBadge error`)}
                                badgeContent={values[item] ? badgeOK : badgeERROR}
                                title={values[item] ? `Your ${item} Id is ${values[item]}` : `Your ${item} Id is not linked`}
                                aria-label={values[item] ? `Your ${item} Id is ${values[item]}` : `Your ${item} Id is not linked`}>
                                <Avatar
                                    className="researchIdAvatar"
                                    src={require(`../../../../src/images/${item.toLowerCase()}_icon.svg`)}
                                    title={`${item} Id`}/>
                            </Badge>
                        </a>
                    </div>
                )
            )}

            {values.orcid &&
            <div className="column is-narrow">
                <a className="orcidLink"
                   href={'http://orcid.org/' + values.orcid}
                   target="_blank"
                   aria-label="Click to visit your ORCId profile"
                   title="Click to visit your ORCId profile">
                    orcid.org/{values.orcid}</a>
            </div>
            }
        </div>
    );
};

DashboardResearcherIds.propTypes = {
    values: PropTypes.shape({
        publons: PropTypes.any,
        researcher: PropTypes.any,
        scopus: PropTypes.any,
        google_scholar: PropTypes.any,
        orcid: PropTypes.any
    })
};

export default DashboardResearcherIds;
