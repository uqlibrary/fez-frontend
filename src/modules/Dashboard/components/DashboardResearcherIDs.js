import React from 'react';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

const DashboardResearcherIDs = ({publonsId, researcherId, scopusId, googleScholarId, orcidId}) => {
    const badgeOK = (<FontIcon className="material-icons">done</FontIcon>);
    const badgeERROR = (<FontIcon className="material-icons">close</FontIcon>);
    const badgeStyle = {top: 15, right: -5};
    const idLabel = ['publons', 'researcher', 'scopus', 'google_scholar', 'orcid'];
    const idName = ['Publons', 'Researcher', 'Scopus', 'Google Scholar', 'ORCid'];
    const idValues = [publonsId, researcherId, scopusId, googleScholarId, orcidId];

    return (
        <div className="columns researcherIDs is-gapless is-marginless is-paddingless">
            {idLabel.map((item, index) => (
                    <div key={index} className={`${item} column is-narrow`}>
                        <a href="https://app.library.uq.edu.au/#/id" target="_blank">
                            <Badge
                                badgeStyle={badgeStyle}
                                className={idValues[index] ? (`${idLabel[index]} researchIDBadge ok`) : (`${idLabel[index]} researchIDBadge error`)}
                                badgeContent={idValues[index] ? badgeOK : badgeERROR}
                                title={idValues[index] ? `Your ${idName[index]} ID is ${idValues[index]}` : `Your ${idName[index]} ID is not linked`}
                                aria-label={idValues[index] ? `Your ${idName[index]} ID is ${idValues[index]}` : `Your ${idName[index]} ID is not linked`}
                            >
                                <Avatar
                                    className="researchIDAvatar"
                                    src={`../../src/images/${idLabel[index]}_icon.svg`}
                                    title={`${idName[index]} ID`}/>
                            </Badge>
                        </a>
                    </div>
                )
            )};
            {orcidId &&
            <div className="column is-narrow">
                <a className="orcidLink"
                   href={'http://orcid.org/' + orcidId}
                   target="_blank"
                   aria-label="Click to visit your ORCID profile"
                   title="Click to visit your ORCID profile">
                    orcid.org/{orcidId}</a>
            </div>
            }
        </div>
    );
};

DashboardResearcherIDs.propTypes = {
    publonsId: PropTypes.string,
    researcherId: PropTypes.string,
    scopusId: PropTypes.string,
    googleScholarId: PropTypes.string,
    orcidId: PropTypes.string,
};

export default DashboardResearcherIDs;
