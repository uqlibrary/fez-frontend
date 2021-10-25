import React from 'react';
import { useHistory, useLocation } from 'react-router';
import Button from '@material-ui/core/Button';
import { pathConfig } from '../../../../config';

const BackToSearchButton = props => {
    const history = useHistory();
    const location = useLocation();
    const handleReturnToSearchClick = () =>
        location.state?.fromSearch ? history.goBack() : history.push(pathConfig.journals.search);
    return (
        <Button
            variant="contained"
            type="submit"
            color="primary"
            id="return-to-search-results-button"
            data-testid="return-to-search-results-button"
            onClick={handleReturnToSearchClick}
            {...props}
        />
    );
};

export default React.memo(BackToSearchButton);
