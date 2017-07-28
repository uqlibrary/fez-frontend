import React from 'react';
import PropTypes from 'prop-types';

const DashboardAccountDetails = ({account}) => {
    const avatar = require('../../../../public/images/avatar.png');
    return (
      <div className="user-information columns">

           {/* Photo */}
          <div className="column is-narrow">
              <div className="accountHeadshot">
                  <img src={avatar} alt={account.get('name')} />
              </div>
          </div>

          {/* Account details */}
          <div className="column is-narrow accountDetails">
              <div className="title is-3 color-reverse">{account.get('title')} {account.get('name')}</div>
              <div className="body-2 color-reverse">{account.get('fullTitle')} <span className="body-2 color-reverse">{account.get('school')}</span></div>
          </div>

      </div>
    );
};

DashboardAccountDetails.propTypes = {
    account: PropTypes.object.isRequired,
};

export default DashboardAccountDetails;
