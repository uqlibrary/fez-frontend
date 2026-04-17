import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import { pathConfig } from 'config';
const BackToSearchButton = props => {
    const navigate = useNavigate();
    const { prevLocation, ...otherProps } = props;
    const handleReturnToSearchClick = () =>
        prevLocation ? navigate(prevLocation, { replace: true }) : navigate(pathConfig.journals.search);
    return (
        <Button
            variant="contained"
            type="submit"
            color="primary"
            id="return-to-search-results-button"
            data-analyticsid="return-to-search-results-button"
            data-testid="return-to-search-results-button"
            onClick={handleReturnToSearchClick}
            {...otherProps}
        />
    );
};

BackToSearchButton.propTypes = {
    prevLocation: PropTypes.object,
};

export default React.memo(BackToSearchButton);
