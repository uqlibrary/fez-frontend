import React from 'react';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';


const SCOPUSlogo = require('images/scopus_icon.svg');
const PUBMEDlogo = require('images/pubmed_icon.svg');
const RIDlogo = require('images/rid_icon.svg');
const ORCIDlogo = require('images/orcid_icon.svg');

const DashboardResearcherIDs = ({account}) => {
    const ORCIDbadgeLink = (
      <a href={'http://' + account.get('orcid_id')} target="_blank" ><FontIcon className="material-icons">done</FontIcon></a>
    );

    const RIDbadgeLink = (
      <a href={'http://' + account.get('orcid_id')} target="_blank" ><FontIcon className="material-icons">close</FontIcon></a>
    );

    const PUBMEDbadgeLink = (
      <a href={'http://' + account.get('orcid_id')} target="_blank" ><FontIcon className="material-icons">done</FontIcon></a>
    );

    const SCOPUSbadgeLink = (
      <a href={'http://' + account.get('orcid_id')} target="_blank" ><FontIcon className="material-icons">close</FontIcon></a>
    );

    return (
      <div className="columns researcherIDs is-gapless">

          {/* ORCHID */}
          <div className="ORCID column is-narrow">
              <Badge className="researchIDBadge ok" badgeContent={ORCIDbadgeLink} badgeStyle={{top: 12, right: -5}}>
                  <Avatar className="researchIDAvatar" src={ORCIDlogo} backgroundColor="white"/>
              </Badge>
          </div>

          {/* RESEARCHID */}
          <div className="RID column is-narrow">
              <Badge className="researchIDBadge error" badgeContent={RIDbadgeLink} badgeStyle={{top: 12, right: -5}}>
                  <Avatar className="researchIDAvatar" src={RIDlogo} backgroundColor="white"/>
              </Badge>
          </div>

          {/* SCOPUS */}
          <div className="Scopus column is-narrow">
              <Badge className="researchIDBadge error" badgeContent={SCOPUSbadgeLink} badgeStyle={{top: 12, right: -5}}>
                  <Avatar className="researchIDAvatar" src={SCOPUSlogo} backgroundColor="#126370"/>
              </Badge>
          </div>

          {/* PUBMED */}
          <div className="PubMed column is-narrow">
              <Badge className="researchIDBadge ok" badgeContent={PUBMEDbadgeLink} badgeStyle={{top: 12, right: -5}}>
                  <Avatar className="researchIDAvatar" src={PUBMEDlogo} backgroundColor="white"/>
              </Badge>
          </div>

      </div>
    );
};

DashboardResearcherIDs.propTypes = {
    account: PropTypes.object.isRequired,
};

export default DashboardResearcherIDs;
