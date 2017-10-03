import React from 'react';
import PropTypes from 'prop-types';
import {StandardPage} from 'uqlibrary-react-toolbox';

// forms & custom components
import {Stepper} from 'modules/SharedComponents/Stepper';
import {PublicationSearchForm} from 'modules/PublicationSearchForm';

import {locale, ROUTES} from 'config';

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
        this.props.history.push(ROUTES.records.searchResults);
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <StandardPage title={txt.title}>
                <Stepper activeStep={0} steps={txt.stepper} />
                <PublicationSearchForm locale={txt.step1} onSubmit={this._performSearch}/>
            </StandardPage>
        );
    }
}
