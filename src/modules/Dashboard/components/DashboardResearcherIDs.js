import React from 'react';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

const SCOPUSlogo = require('images/scopus_icon.svg');
const PUBMEDlogo = require('images/pubmed_icon.svg');
const RIDlogo = require('images/rid_icon.svg');
const ORCIDlogo = require('images/orcid_icon.svg');
const GOOGLElogo = require('images/googlescholar_icon.svg');
const PUBLONSlogo = require('images/publons_icon.svg');


const badgeStyle = {
    top: 15,
    right: -5
};

const DashboardResearcherIDs = ({account}) => {
    const badgeOK = (<FontIcon className="material-icons">done</FontIcon>);
    const badgeERROR = (<FontIcon className="material-icons">close</FontIcon>);

    return (
      <div className="columns researcherIDs is-gapless">

          {/* PUBLONS */}
          <div className="PUBLONS column is-narrow">
              <Badge className="researchIDBadge ok" badgeContent={badgeOK} badgeStyle={badgeStyle}>
                  <Avatar className="researchIDAvatar" src={PUBLONSlogo} title="Publons ID is valid"/>
              </Badge>
          </div>

          {/* RESEARCHID */}
          <div className="RID column is-narrow">
              <Badge className="researchIDBadge ok" badgeContent={badgeOK} badgeStyle={badgeStyle}>
                  <Avatar className="researchIDAvatar" src={RIDlogo} title="ResearchID is valid"/>
              </Badge>
          </div>

          {/* SCOPUS */}
          <div className="Scopus column is-narrow">
              <Badge className="researchIDBadge ok" badgeContent={badgeOK} badgeStyle={badgeStyle}>
                  <Avatar className="researchIDAvatar" src={SCOPUSlogo} title="Scopus ID is valid"/>
              </Badge>
          </div>

          {/* PUBMED */}
          <div className="PubMed column is-narrow">
              <Badge className="researchIDBadge error" badgeContent={badgeERROR} badgeStyle={badgeStyle}>
                  <Avatar className="researchIDAvatar" src={PUBMEDlogo} title="PubMed ID is missing"/>
              </Badge>
          </div>

          {/* GOOGLE SCHOLAR */}
          <div className="GoogleScholar column is-narrow">
              <Badge className="researchIDBadge error" badgeContent={badgeERROR} badgeStyle={badgeStyle}>
                  <Avatar className="researchIDAvatar" src={GOOGLElogo} title="Google Scholar ID is missing"/>
              </Badge>
          </div>

          {/* ORCHID */}
          <div className="ORCID column is-narrow">
              <Badge className="researchIDBadge ok" badgeContent={badgeOK} badgeStyle={badgeStyle}>
                  <Avatar className="researchIDAvatar" src={ORCIDlogo} title="Orcid ID is valid"/>
              </Badge>
          </div>

          {/* ORCHID LINK */}
          <div className="column is-narrow">
              <a className="ORCIDlink" href={'http://' + account.get('orcid_id')} target="_blank">{account.get('orcid_id')}</a>
          </div>

      </div>
    );
};

DashboardResearcherIDs.propTypes = {
    account: PropTypes.object.isRequired,
};

export default DashboardResearcherIDs;
