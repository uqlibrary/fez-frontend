import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';

import DashboardResearcherIDs from 'modules/Dashboard/components/DashboardResearcherIDs';

const DashboardAccountDetails = ({account}) => {
    // const avatar = require('https://its-ss-uqresearchers.s3.amazonaws.com/photo/thumbnail_228.jpg');

    return (
      <div className="userDetails columns">
           {/* Photo */}
          <div className="column is-narrow">
              <div className="accountHeadshot">
                  <Avatar size={150} src="https://its-ss-uqresearchers.s3.amazonaws.com/photo/228.jpg" backgroundColor="transparent"/>
              </div>
          </div>
          {/* Account details */}
          <div className="column is-narrow accountDetails">
              <div className="accountTitleName title is-3 color-reverse">{account.get('title')} {account.get('given_name')} {account.get('family_name')}</div>
              {/* TODO This will be passed through an array map to produce the list */}
              <div className="accountPositionOrg color-reverse">
                  <strong>{account.get('position')}</strong>
                  {account.get('position').length > 0 ? ', ' : ''}
                  <span className="color-reverse">{account.get('org_unit')}</span></div>
              <DashboardResearcherIDs account={account} />
          </div>

      </div>
    );
};

DashboardAccountDetails.propTypes = {
    account: PropTypes.object.isRequired,
};

export default DashboardAccountDetails;
