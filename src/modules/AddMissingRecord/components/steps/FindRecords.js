import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import { PublicationSearchForm } from 'modules/SharedComponents/PublicationSearchForm';
import { pathConfig } from 'config/pathConfig';
import locale from 'locale/pages';
import { sanitizeDoi } from 'config/validation';

export default class FindRecords extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        navigate: PropTypes.func.isRequired,
    };

    _performSearch = values => {
        this.props.actions.searchPublications(sanitizeDoi(values.get('searchQuery')));
        this.props.navigate(pathConfig.records.add.results);
    };

    _handleSkipSearch = () => {
        this.props.navigate(pathConfig.records.add.new);
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <PublicationSearchForm
                locale={txt.step1}
                onSubmit={this._performSearch}
                onSkipSearch={this._handleSkipSearch}
            />
        );
    }
}
