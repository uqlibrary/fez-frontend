import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import {routes} from 'config';
import {locale} from 'locale';

import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import RaisedButton from 'material-ui/RaisedButton';

export class MyLatestPublications extends PureComponent {
    static propTypes = {
        latestPublicationsList: PropTypes.array,
        totalPublicationsCount: PropTypes.number,
        history: PropTypes.object.isRequired
    };

    _viewYourResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    };

    render() {
        const txt = locale.components.myLatestPublications;
        return (
            <div  className="latestPubs">
                <PublicationsList
                    publicationsList={this.props.latestPublicationsList}
                    showDefaultActions/>
                <div className="columns">
                    <div className="column is-hidden-mobile"/>
                    <div className="column is-narrow">
                        <RaisedButton
                            secondary
                            label={`${txt.viewAllButtonLabel} (${this.props.totalPublicationsCount})`}
                            onTouchTap={this._viewYourResearch}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(MyLatestPublications);

