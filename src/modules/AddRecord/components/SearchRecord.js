import React from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import {PublicationSearchForm} from 'modules/PublicationSearchForm';
import {locale, routes} from 'config';

export default class SearchRecord extends React.Component {
    static propTypes = {
        actions: PropTypes.object,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    _performSearch = (values) => {
        this.props.actions.searchPublications(values.get('searchQuery'));
        this.props.history.push(routes.pathConfig.records.add.results);
    };

    _handleSkipSearch = () => {
        this.props.history.push(routes.pathConfig.records.add.new);
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <PublicationSearchForm locale={txt.step1} onSubmit={this._performSearch} onSkipSearch={this._handleSkipSearch}/>
        );
    }
}
