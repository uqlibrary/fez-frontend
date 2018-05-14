import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {locale} from 'locale';

import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import RaisedButton from 'material-ui/RaisedButton';

export default class TopCitedPublications extends PureComponent {
    static propTypes = {
        topCitedPublicationsList: PropTypes.array,
        loadingTopCitedPublications: PropTypes.bool,
        actions: PropTypes.object.isRequired
    };

    static defaultProps = {
        topCitedPublicationsList: [],
        loadingTopCitedPublications: false
    };

    componentDidMount() {
        if (!this.props.loadingTopCitedPublications) {
            this.props.actions.searchTopCitedPublications();
        }
    }

    showAllPublications = () => {
        // redirect to search result page
    };

    render() {
        const txt = locale.components.topCitedPublications;

        if (this.props.loadingTopCitedPublications) {
            return (
                <div className="isLoading is-centered">
                    <InlineLoader message={txt.loading}/>
                </div>
            );
        }

        return (
            <div className="topCitedPubs">
                <PublicationsList
                    publicationsList={this.props.topCitedPublicationsList}
                />
                <div className="columns">
                    <div className="column is-hidden-mobile"/>
                    <div className="column is-narrow">
                        <RaisedButton
                            secondary
                            label={`${txt.showAllButtonLabel}`}
                            onClick={this.showAllPublications}/>
                    </div>
                </div>
            </div>
        );
    }
}


