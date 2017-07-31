import React from 'react';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

const badgeStyle = {top: 15, right: -5};

const DashboardResearcherIDs = ({account}) => {
    const badgeOK = (<FontIcon className="material-icons">done</FontIcon>);
    const badgeERROR = (<FontIcon className="material-icons">close</FontIcon>);

    const idList = ['publons', 'researcher', 'scopus', 'pubmed', 'google_scholar', 'orcid'];

    return (
        <div className="columns researcherIDs is-gapless">
            {idList.map((item, index) => {
                return (
                    <div key={index} className={[`${item} column is-narrow`]}>
                        <a href="https://app.library.uq.edu.au/#/id" target="_blank">
                            <Badge
                                className={account.get(`${item}_id`) ? 'researchIDBadge ok' : 'researchIDBadge error'}
                                badgeContent={account.get(`${item}_id`) ? badgeOK : badgeERROR} badgeStyle={badgeStyle}
                                aria-label={account.get(`${item}_id`) ? (`Your ${item} ID is ` + account.get(`${item}_id`) + ' - Click to review') :
                                    (`Your ${item} ID is not yet linked - Click to review`)}
                                title={account.get(`${item}_id`) ? (`Your ${item} ID is ` + account.get(`${item}_id`) + ' - Click to review') :
                                    (`Your ${item} ID is not yet linked - Click to review`)}>
                                <Avatar className="researchIDAvatar" src={`../../src/images/${item}_icon.svg`}
                                        title={`${item} ID`}/>
                            </Badge></a>
                    </div>
                );
            })};

            {account.get('orcid_id') &&
            <div className="column is-narrow">
                <a className="orcidLink"
                   href={'http://orcid.org/' + account.get('orcid_id')}
                   target="_blank"
                   aria-label="Click to visit your ORCID profile"
                   title="Click to visit your ORCID profile">
                    orcid.org/{account.get('orcid_id')}</a>
            </div>
            }

        </div>
    );
};

DashboardResearcherIDs.propTypes = {
    account: PropTypes.object.isRequired,
};

export default DashboardResearcherIDs;
