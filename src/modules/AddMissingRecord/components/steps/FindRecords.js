import React from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import { PublicationSearchForm } from 'modules/SharedComponents/PublicationSearchForm';
import { pathConfig } from 'config/pathConfig';
import locale from 'locale/pages';
import { sanitizeDoi } from 'config/validation';
import { useNavigate } from 'react-router-dom';

export const FindRecords = ({ actions }) => {
    const navigate = useNavigate();
    const _performSearch = values => {
        actions.searchPublications(sanitizeDoi(values.get('searchQuery')));
        navigate(pathConfig.records.add.results);
    };

    const _handleSkipSearch = () => {
        navigate(pathConfig.records.add.new);
    };

    const txt = locale.pages.addRecord;
    return <PublicationSearchForm locale={txt.step1} onSubmit={_performSearch} onSkipSearch={_handleSkipSearch} />;
};

FindRecords.propTypes = {
    actions: PropTypes.object,
};

export default React.memo(FindRecords);
