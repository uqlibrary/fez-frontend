import React from 'react';
import Button from '@material-ui/core/Button';

const BackToSearchButton = props => {
    return (
        <Button
            variant="contained"
            type="submit"
            color="primary"
            id="return-to-search-results-button"
            data-testid="return-to-search-results-button"
            {...props}
        />
    );
};

export default React.memo(BackToSearchButton);
