import React from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Stepper } from 'modules/SharedComponents/Toolbox/Stepper';
import { pathConfig } from 'config/pathConfig';
import locale from 'locale/pages';
import { useNavigate, useLocation } from 'react-router-dom';

export const AddMissingRecord = ({ rawSearchQuery, addRecordStep: AddRecordStep, ...props }) => {
    const location = useLocation();
    const navigate = useNavigate();

    if (!rawSearchQuery && location.pathname === pathConfig.records.add.results) {
        navigate(pathConfig.records.add.find, { replace: true });
    }

    const getStepperIndex = location => {
        const locationTokens = location.split('/').filter(Boolean);
        if (locationTokens.length !== 3) return 0;
        const configTokens = pathConfig[locationTokens[0]][locationTokens[1]];
        return Object.keys(configTokens).indexOf(locationTokens[2]);
    };

    const txt = locale.pages.addRecord;

    return (
        <StandardPage title={txt.title}>
            <Stepper activeStep={getStepperIndex(location.pathname)} steps={txt.stepper} />
            <AddRecordStep {...{ ...props, rawSearchQuery }} />
        </StandardPage>
    );
};
AddMissingRecord.propTypes = {
    rawSearchQuery: PropTypes.string,
    addRecordStep: PropTypes.func,
};

export default React.memo(AddMissingRecord);
