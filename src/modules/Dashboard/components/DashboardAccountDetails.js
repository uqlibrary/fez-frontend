import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';

import DashboardResearcherIDs from 'modules/Dashboard/components/DashboardResearcherIDs';

const DashboardAccountDetails = ({account}) => {
    const avatar = require('../../../../public/images/avatar.png');

    return (
      <div className="userDetails columns">
           {/* Photo */}
          <div className="column is-narrow">
              <div className="accountHeadshot">
                  <Avatar size={150} src={avatar} backgroundColor="transparent"/>
              </div>
          </div>
          {/* Account details */}
          <div className="column is-narrow accountDetails">
              <div className="accountTitleName title is-3 color-reverse">{account.get('title')} {account.get('name')}</div>
              <div className="accountPositionOrg color-reverse"><strong>{account.get('position')}</strong> - <span className="color-reverse">{account.get('org_unit')}</span></div>
              <DashboardResearcherIDs account={account} />
          </div>

      </div>
    );
};

DashboardAccountDetails.propTypes = {
    account: PropTypes.object.isRequired,
};

export default DashboardAccountDetails;
