import React from 'react';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

const DashboardResearcherIDs = ({values}) => {
    const badgeOK = (<FontIcon className="material-icons">done</FontIcon>);
    const badgeERROR = (<FontIcon className="material-icons">close</FontIcon>);
    const badgeStyle = {right: -5};

    return (
        <div className="columns researcherIDs is-gapless">
            {
                Object.keys(values).map((item, index) => (
                <div key={index} className={`${item} column is-narrow`}>
                    <a href="https://app.library.uq.edu.au/#/id" target="_blank">
                        <Badge
                            badgeStyle={badgeStyle}
                            className={values[item] ? (`${item.toLowerCase()} researchIDBadge ok`) : (`${item.toLowerCase()} researchIDBadge error`)}
                            badgeContent={values[item] ? badgeOK : badgeERROR}
                            title={values[item] ? `Your ${item} ID is ${values[item]}` : `Your ${item} ID is not linked`}
                            aria-label={values[item] ? `Your ${item} ID is ${values[item]}` : `Your ${item} ID is not linked`} >
                            <Avatar
                                className="researchIDAvatar"
                                src={require(`../../../../src/images/${item.toLowerCase()}_icon.svg`)}
                                title={`${item} ID`} />
                        </Badge>
                    </a>
                </div>
                )
            )}

            {
                values.ORCid &&
                <div className="column is-narrow">
                    <a className="orcidLink"
                       href={'http://orcid.org/' + values.ORCid}
                       target="_blank"
                       aria-label="Click to visit your ORCID profile"
                       title="Click to visit your ORCID profile">
                        orcid.org/{values.ORCid}</a>
                </div>
            }
        </div>
    );
};

DashboardResearcherIDs.propTypes = {
    values: PropTypes.shape({
        Publons: PropTypes.any,
        Researcher: PropTypes.any,
        Scopus: PropTypes.any,
        Google_Scholar: PropTypes.any,
        ORCid: PropTypes.any
    })
};

export default DashboardResearcherIDs;
