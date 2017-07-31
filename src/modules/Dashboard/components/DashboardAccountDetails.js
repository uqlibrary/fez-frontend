import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';

import DashboardResearcherIDs from 'modules/Dashboard/components/DashboardResearcherIDs';

const DashboardAccountDetails = ({account}) => {
    const positions = account.get('positions');
    return (
        <div className="userDetails columns">
            {/* Photo */}
            <div className="column is-narrow">
                <div className="accountHeadshot">
                    <Avatar size={150}
                            style={{
                                backgroundImage: 'url("https://its-ss-uqresearchers.s3.amazonaws.com/photo/thumbnail_' + account.get('uqr_id') + '.jpg"), url("/public/images/avatar.jpg")',
                                backgroundSize: 'cover, cover'
                            }}
                            backgroundColor="transparent"
                            aria-label={'Photograph of ' + account.get('title') + ' ' + account.get('given_name') + ' ' + account.get('family_name')}
                            title={account.get('title') + ' ' + account.get('given_name') + ' ' + account.get('family_name')}/>
                </div>
            </div>
            {/* Account Name/Positions/OrgUnits */}
            <div className="column is-narrow accountDetails">
                <div className="accountTitleName title is-3 color-reverse">
                    {account.get('title')} {account.get('given_name')} {account.get('family_name')}
                </div>
                <div className="column is-paddingless is-marginless is-narrow">
                    {positions.map((item, index) => (
                        <div key={index} className="accountPositionOrg color-reverse">
                            <strong>{item}</strong>
                            {item.length > 0 ? ', ' : ''}
                            <span className="color-reverse">{account.get('org_units').get(index)}</span>
                        </div>
                    ))}
                </div>
                <DashboardResearcherIDs account={account}/>
            </div>

        </div>
    );
};

DashboardAccountDetails.propTypes = {
    account: PropTypes.object.isRequired,
};

export default DashboardAccountDetails;
