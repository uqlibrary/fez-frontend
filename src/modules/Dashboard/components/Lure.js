import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const Lure = ({claimPublicationResults}) => {
    return (
        <div>
            {claimPublicationResults && claimPublicationResults.size > 0 && this.state.showAppbar && (
                <div className="warning alertWrapper">
                    <div className="columns">
                        <div className="column is-narrow alertIcon">
                            <FontIcon className="material-icons">warning</FontIcon>
                        </div>
                        <div className="column alertText">
                            {`We have found ${claimPublicationResults.size} article(s) that could possibly be your work.`}
                        </div>
                        <div className="column is-narrow claim-button">
                            <FlatButton label="Claim your publications now"
                                        onTouchTap={this.claimYourPublications}
                                        className="claim-publications"/>
                        </div>
                        <div className="column is-narrow is-hidden-mobile">
                            <IconButton onTouchTap={this.hideAppBar}><NavigationClose
                                className="hide-appbar"/></IconButton>
                        </div>
                    </div>
                </div> )}
        </div>
    );
};

Lure.propTypes = {
    claimPublicationResults: PropTypes.any
};

export default Lure;
