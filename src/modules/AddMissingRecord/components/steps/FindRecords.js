import React from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import { PublicationSearchForm } from 'modules/SharedComponents/PublicationSearchForm';
import { pathConfig } from 'config/pathConfig';
import locale from 'locale/pages';
import { sanitizeDoi } from 'config/validation';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { searchPublications } from '../../../../actions';

export const FindRecords = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const _performSearch = values => {
        dispatch(searchPublications(sanitizeDoi(values.get('searchQuery'))));
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
