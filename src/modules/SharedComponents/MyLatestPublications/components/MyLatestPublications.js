import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import {routes} from 'config';
import {locale} from 'locale';

import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import RaisedButton from 'material-ui/RaisedButton';

export class MyLatestPublications extends PureComponent {
    static propTypes = {
        latestPublicationsList: PropTypes.array,
        totalPublicationsCount: PropTypes.number,
        isLoading: PropTypes.bool,
        history: PropTypes.object.isRequired
    };

    static defaultProps = {
        latestPublicationsList: [],
        totalPublicationsCount: null,
        isLoading: false
    };

    _viewYourResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    };

    render() {
        const txt = locale.components.myLatestPublications;

        if (this.props.isLoading) {
            return (
                <div className="isLoading is-centered">
                    <InlineLoader message={txt.loading}/>
                </div>
            );
        }

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

