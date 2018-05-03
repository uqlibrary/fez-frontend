import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {routes} from 'config';
import {locale} from 'locale';

import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import RaisedButton from 'material-ui/RaisedButton';

export default class MyLatestPublications extends PureComponent {
    static propTypes = {
        latestPublicationsList: PropTypes.array,
        totalPublicationsCount: PropTypes.number,
        loadingLatestPublications: PropTypes.bool,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired
    };

    static defaultProps = {
        latestPublicationsList: [],
        totalPublicationsCount: null,
        loadingLatestPublications: false
    };

    componentDidMount() {
        this.props.actions.searchLatestPublications();
    }

    _viewMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    };

    render() {
        const txt = locale.components.myLatestPublications;

        if (this.props.loadingLatestPublications) {
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
                            onClick={this._viewMyResearch}/>
                    </div>
                </div>
            </div>
        );
    }
}


